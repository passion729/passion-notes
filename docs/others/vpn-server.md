---
sidebar_position: 1
tags: [梯子]
---

# VPN Server
## VMESS/Torjan
[boy233一键安装脚本通杀](https://github.com/233boy/sing-box)

```shell
bash <(wget -qO- -o- https://github.com/233boy/sing-box/raw/main/install.sh)
```

- `VLESS-REALITY`、`Trojan`、`Hysteria2`、`Shadowsocks`、`VMess-(WS/H2/HTTPUpgrade)-TLS`、`VLESS-(WS/H2/HTTPUpgrade)-TLS`
- 一键启用`BBR`

## SNELL
[一键安装脚本](https://github.com/passeway/Snell)

```bash
bash <(curl -fsSL snell-ten.vercel.app)
```

## Hysteria2
使用官方脚本
```shell
# 安装
bash <(curl -fsSL https://get.hy2.sh/)

# 卸载
bash <(curl -fsSL https://get.hy2.sh/) --remove
```
写入自签证书
```shell
# 伪装域名使用bing.com
openssl req -x509 -nodes -newkey ec:<(openssl ecparam -name prime256v1) -keyout /etc/hysteria/server.key -out /etc/hysteria/server.crt -subj "/CN=bing.com" -days 36500 && sudo chown hysteria /etc/hysteria/server.key && sudo chown hysteria /etc/hysteria/server.crt
```
创建HY2配置文件
```yaml title="/etc/hysteria/config.yaml"
listen: :443 #监听端口，可以自定义

#使用自签证书
tls:
  cert: /etc/hysteria/server.crt
  key: /etc/hysteria/server.key

auth:
  type: password
  password: 123456 #密码

masquerade:
  type: proxy
  proxy:
    url: https://bing.com #伪装网址
    rewriteHost: true

# 无带宽限制可移除
bandwidth:
  up: 100 mbps       # 按需修改
  down: 30 mbps       # 按需修改
```
重启服务
```shell
systemctl enable hysteria-server.service
systemctl restart hysteria-server.service
```
配置端口跳跃, 应对运营商UDP QoS端口限速和阻断 [官方文档](https://v2.hysteria.network/zh/docs/advanced/Port-Hopping/)
```shell
# 修改端口范围和服务监听端口
# IPv4
iptables -t nat -A PREROUTING -i eth0 -p udp --dport 20000:50000 -j REDIRECT --to-ports 443
# IPv6
ip6tables -t nat -A PREROUTING -i eth0 -p udp --dport 20000:50000 -j REDIRECT --to-ports 443
```
对应Surge中打开`Port Hopping`配置即可