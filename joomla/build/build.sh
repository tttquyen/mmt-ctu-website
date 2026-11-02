#!/usr/bin/env bash
# ============================================================================
# Dựng gói cài đặt Joomla 5 cho website Khoa MMT&TT từ nội dung tĩnh mmt/, enmmt/.
#
#   bash joomla/build/build.sh            -> joomla/dist/mmt-joomla-<ngày>.zip
#
# Cần: php 8.1+ (mysqli, zip, gd, intl, mbstring, xml), mariadb-server hoặc mysql,
#      python3, zip, curl. Chạy với quyền root trên máy build (dùng mysql -uroot).
# Biến môi trường tuỳ chọn: JOOMLA_VERSION (mặc định 5.4.10), WORK (thư mục tạm).
# ============================================================================
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
J="$REPO/joomla"
VER="${JOOMLA_VERSION:-5.4.10}"
WORK="${WORK:-$(mktemp -d)}"
SITE="$WORK/site"
DB=mmt_build
PORT=8095
PASS="Build-$(date +%s)-tmp"          # mật khẩu tạm; trình cài trên host sẽ đặt lại
STAMP="$(date +%Y%m%d)"

echo "== Thư mục tạm: $WORK"
mkdir -p "$J/dist" "$WORK"

# ---------------------------------------------------------------- 1. Joomla
ZIP="$WORK/Joomla_$VER.zip"
if [ ! -f "$ZIP" ]; then
  echo "== Tải Joomla $VER"
  curl -fsSL -o "$ZIP" "https://github.com/joomla/joomla-cms/releases/download/$VER/Joomla_$VER-Stable-Full_Package.zip"
fi
rm -rf "$SITE"; mkdir -p "$SITE"; (cd "$SITE" && unzip -q "$ZIP")

# ---------------------------------------------------------------- 2. CSDL + cài đặt
(service mariadb start || service mysql start) >/dev/null 2>&1 || true
mysql -uroot -e "DROP DATABASE IF EXISTS $DB; CREATE DATABASE $DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'mmtbuild'@'localhost' IDENTIFIED BY 'mmtbuild'; GRANT ALL ON $DB.* TO 'mmtbuild'@'localhost';"
echo "== Cài Joomla"
php "$SITE/installation/joomla.php" install -n --site-name="Khoa Mạng máy tính và Truyền thông" \
  --admin-user="Quản trị website" --admin-username=admin --admin-password="$PASS" \
  --admin-email=lt_mmt_tt@cit.ctu.edu.vn --db-type=mysqli --db-host=localhost \
  --db-user=mmtbuild --db-pass=mmtbuild --db-name=$DB --db-prefix=mmt_ >/dev/null

cfg() { sed -i -E "s#public \\\$$1 = [^;]*;#public \$$1 = $2;#" "$SITE/configuration.php"; }
cfg live_site "'http://127.0.0.1:$PORT'"
cfg editor "'codemirror'"
cfg offset "'Asia/Ho_Chi_Minh'"
cfg sef "true"; cfg sef_rewrite "false"
cfg MetaDesc "'Khoa Mạng máy tính và Truyền thông, Trường Công nghệ Thông tin và Truyền thông, Đại học Cần Thơ.'"

# ---------------------------------------------------------------- 3. Template + ngôn ngữ
echo "== Cài template mmt và gói vi-VN"
rm -f "$J/dist/tpl_mmt.zip" "$J/dist/site_vi-VN.zip"
(cd "$J/src/tpl_mmt" && zip -qr "$J/dist/tpl_mmt.zip" .)
(cd "$J/src/lang_vi-VN" && zip -qr "$J/dist/site_vi-VN.zip" .)
php "$SITE/cli/joomla.php" extension:install --path="$J/dist/site_vi-VN.zip" >/dev/null
php "$SITE/cli/joomla.php" extension:install --path="$J/dist/tpl_mmt.zip" >/dev/null

# ---------------------------------------------------------------- 4. Nội dung qua API
mysql -uroot $DB -e "UPDATE mmt_extensions SET enabled=1 WHERE folder='api-authentication' AND element='basic'"
php -S 127.0.0.1:$PORT -t "$SITE" "$HERE/router.php" >"$WORK/php.log" 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
python3 "$HERE/import_content.py" --repo "$REPO" --site "$SITE" --url "http://127.0.0.1:$PORT" \
  --password "$PASS" --db $DB
kill $SRV 2>/dev/null || true

# ---------------------------------------------------------------- 5. Dọn dẹp trước khi đóng gói
echo "== Đóng gói"
mysql -uroot $DB -e "UPDATE mmt_extensions SET enabled=0 WHERE folder='api-authentication' AND element='basic';
  DELETE FROM mmt_session; DELETE FROM mmt_action_logs; DELETE FROM mmt_user_keys;
  UPDATE mmt_users SET lastvisitDate=NULL;"
rm -rf "$SITE/cache/"* "$SITE/administrator/cache/"* "$SITE/tmp/"* "$SITE/administrator/logs/"*
touch "$SITE/cache/index.html" "$SITE/administrator/cache/index.html" "$SITE/tmp/index.html" "$SITE/administrator/logs/index.html"

# configuration.php -> mẫu có chỗ trống cho trình cài
mkdir -p "$SITE/installation"
python3 - "$SITE/configuration.php" "$SITE/installation/configuration.php-dist" <<'PY'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
def put(key, val):
    global s
    s, n = re.subn(r"(public \$" + key + r" = )[^;]*;", lambda m: m.group(1) + val + ';', s)
    assert n == 1, key
for k, v in {'sitename': "'{{SITENAME}}'", 'host': "'{{DBHOST}}'", 'user': "'{{DBUSER}}'",
             'password': "'{{DBPASS}}'", 'db': "'{{DBNAME}}'", 'dbprefix': "'{{DBPREFIX}}'",
             'secret': "'{{SECRET}}'", 'mailfrom': "'{{MAILFROM}}'", 'log_path': "'{{LOGPATH}}'",
             'tmp_path': "'{{TMPPATH}}'", 'live_site': "''", 'sef_rewrite': '{{REWRITE}}',
             'force_ssl': '{{FORCESSL}}', 'debug': 'false', 'error_reporting': "'default'",
             'dbtype': "'mysqli'", 'session_handler': "'database'"}.items():
    put(k, v)
open(sys.argv[2], 'w', encoding='utf-8').write(s)
PY
rm -f "$SITE/configuration.php"

mysqldump -uroot --default-character-set=utf8mb4 --skip-comments --no-tablespaces --skip-lock-tables \
  --net-buffer-length=400000 --hex-blob $DB | grep -v "^/\*M!999999" > "$SITE/installation/mmt-joomla.sql"
cp "$J/installer/index.php" "$SITE/installation/index.php"

OUT="$J/dist/mmt-joomla-$STAMP.zip"
rm -f "$OUT"
(cd "$SITE" && zip -qr -9 "$OUT" . -x 'images/mmt/**/.DS_Store')
mysql -uroot -e "DROP DATABASE $DB; DROP USER IF EXISTS 'mmtbuild'@'localhost';"
echo "== Xong: $OUT ($(du -h "$OUT" | cut -f1))"
