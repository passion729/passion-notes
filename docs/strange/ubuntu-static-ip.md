---
sidebar_position: 1
tags: [ubuntu]
---

# Ubuntu server static ip stick back when reboot
需关闭cloud-init
```shell
sudo touch /etc/cloud/cloud-init.disabled
sudo reboot 
```
删除该文件则重新启用