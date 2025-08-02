---
sidebar_position: 2
---

# 公网IP相关

1. Ubuntu Server PPPoE拨号
2. 双WAN Route配置
3. 配置NAT和转发规则, 并持久化配置
4. 配置系统TCP连接参数提速
5. 网络性能测试

---

## Ubuntu Server PPPoE拨号

```shell
sudo apt install pppoe pppoeconf
sudo pppoeconf

# 查看连接状态
plog

# 手动启用/关闭连接
sudo pon dsl-provider
sudo poff dsl-provider

# 查看PPPoE接口状态
ifconfig ppp0
```

> 全部选`YES`, **注意输入UserName时要删除自带的占位符**

## 双WAN Route配置

### 1. 查看网口路由信息和状态

```shell
ip route show
ip addr show
```

假设配置如下：
ppp0: PPPoE拨号，公网IP
eth0: 内网接口，内网IP（如 192.168.1.3）

### 2. 配置路由表

```shell title="/etc/iproute2/rt_tables"
...
# Append
100 pppoe
101 lan
```

创建配置脚本

```shell title="/etc/network/dual-wan.sh"
#!/bin/bash

# 获取接口信息
# 根据实际情况修改接口名称
PPPOE_IF="ppp0"
LAN_IF="eth0"

PPPOE_IP=$(ip addr show $PPPOE_IF | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
LAN_IP=$(ip addr show $LAN_IF | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
LAN_GW="192.168.1.1"  # 内网网关，根据实际情况修改

# 清除已有规则
ip rule del from $PPPOE_IP table pppoe 2>/dev/null
ip rule del from $LAN_IP table lan 2>/dev/null
ip route flush table pppoe 2>/dev/null
ip route flush table lan 2>/dev/null

# 添加路由表规则
ip rule add from $PPPOE_IP table pppoe priority 100
ip rule add from $LAN_IP table lan priority 101

# 配置PPPoE路由表
ip route add default dev $PPPOE_IF table pppoe
ip route add 192.168.1.0/24 dev $LAN_IF table pppoe  # 内网网段，根据实际情况修改

# 配置LAN路由表
ip route add default via $LAN_GW dev $LAN_IF table lan
ip route add 192.168.1.0/24 dev $LAN_IF table lan  # 内网网段，根据实际情况修改

# 主路由表设置（默认走PPPoE）
ip route del default 2>/dev/null
ip route add default dev $PPPOE_IF

echo "双WAN路由配置完成"
```

设置权限并运行:

```shell
sudo chmod +x /etc/network/dual-wan.sh
sudo /etc/network/dual-wan.sh
```

## 配置NAT和转发规则, 并持久化配置

### 1. 创建配置脚本

```shell title="/etc/network/firewall.sh"
#!/bin/bash

# 启用IP转发
echo 1 > /proc/sys/net/ipv4/ip_forward

# 清除现有规则
iptables -F
iptables -t nat -F
iptables -t mangle -F

# 基本策略
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# PPPoE接口的NAT规则
iptables -t nat -A POSTROUTING -o ppp0 -j MASQUERADE

# 允许已建立的连接
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

# 允许内网访问外网
iptables -A FORWARD -i eth0 -o ppp0 -j ACCEPT

# 如果需要端口转发到内网服务，例如转发8080端口：
# iptables -t nat -A PREROUTING -i ppp0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:8080

echo "防火墙规则配置完成"
```

### 2. 配置开机自启动持久化配置

```shell title="/etc/sysctl.conf"
# uncomment this line
net.ipv4.ip_forward=1
```

创建系统服务

```
[Unit]
Description=Dual WAN Configuration
After=network.target

[Service]
Type=oneshot
ExecStart=/etc/network/dual-wan.sh
ExecStart=/etc/network/firewall.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

```shell
sudo systemctl daemon-reload
sudo systemctl enable dual-wan.service
sudo systemctl start dual-wan.service
```

### 3. 配置更精细的路由策略(可选)

```shell
# 内网流量走内网网关
ip rule add from 192.168.1.0/24 table lan priority 200

# 特定端口的流量走PPPoE
ip rule add sport 80 table pppoe priority 150
ip rule add sport 443 table pppoe priority 150
```

## 配置系统TCP连接参数提速

### 1. TCP发送缓冲区

```shell
# 确保启用TCP窗口缩放
sysctl net.ipv4.tcp_window_scaling  # 应该是1

# 如果是0，启用它
echo 'net.ipv4.tcp_window_scaling = 1' >> /etc/sysctl.conf

# 查看当前TCP缓冲区设置
sysctl net.ipv4.tcp_wmem
sysctl net.ipv4.tcp_rmem

# 优化TCP发送缓冲区
echo 'net.ipv4.tcp_wmem = 4096 131072 67108864' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 131072 67108864' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 67108864' >> /etc/sysctl.conf
echo 'net.core.rmem_max = 67108864' >> /etc/sysctl.conf

sysctl -p
```

### 2. 配置BBR

```shell
# 查看当前拥塞控制算法
sysctl net.ipv4.tcp_congestion_control

# 开启BBR算法（对丢包环境友好）
modprobe tcp_bbr
echo 'net.ipv4.tcp_congestion_control = bbr' >> /etc/sysctl.conf
sysctl -p

# 验证是否生效
sysctl net.ipv4.tcp_congestion_control
```

## 网络性能测试

四个工具:

1. `traceroute`: 路由追踪

   `traceroute -p <port> <ip/domain>`
2. `mtr`: 连续的路由追踪, 带报告

   `sudo mtr -p <port> <ip/domain>`
3. `iperf3`: 节点间网络传输测速
    ```shell
    # 服务端启动, 指定端口
    iperf3 -s -p <port>
    
    # 客户端
    iperf3 -c -p <port> <ServerIP>     # 客户端->服务器，客户端上传, 服务器下载,
    iperf3 -c -p <port> <ServerIP> -R     # 服务器->客户端，服务器上传, 客户端下载
    iperf3 -c -p <port> <ServerIP> --bidir     # 服务器<->客户端，双向测试
    iperf3 -c -p <port> <ServerIP> --bidir -t 30     # 服务器<->客户端，双向测试, 运行30秒
    ```
4. `ping`
    ```shell
    # 小包ping
    ping -s 64 <IP>
    # 大包ping
    ping -s 1472 <IP>
    ```