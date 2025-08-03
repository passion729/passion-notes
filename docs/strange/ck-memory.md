---
sidebar_position: 2
tags: [clickhouse]
---

# Clickhouse在Ubuntu进行查询时报内存不够错误
:::info[description]
执行查询时, clickhouse报如下内存错误:
```shell
code: 241, message: Memory limit (total) exceeded: would use 67.77 GiB (attempt to allocate chunk of 4223432 bytes), current RSS 2.28 GiB, maximum: 56.15 GiB. OvercommitTracker decision: Query was selected to stop by OvercommitTracker.: While executing MergeTreeSelect(pool: ReadPool, algorithm: Thread): Could not process SQL results.
```

:::
### 1. 设置内存过度提交
    ```shell
   sudo sysctl -w vm.overcommit_memory=1
   echo 'vm.overcommit_memory=1' | sudo tee -a /etc/sysctl.conf
   # 含义:
   # 0: 内核会根据一定算法判断是否允许分配（推荐）
   # 1: 允许分配超过物理内存总量（对 ClickHouse 更宽松)
   # 2: 严格限制(❌ 不推荐)
   ```
### 2. 调整 Swap 策略(减少磁盘交换)
    ```shell
    sudo sysctl -w vm.swappiness=10
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
    ```
### 3. 关闭 Transparent Huge Pages(THP)
    ```shell
    cat /sys/kernel/mm/transparent_hugepage/enabled
   
    # 如果不是 [never]，建议关闭：
    sudo vim /etc/default/grub
   # 修改 GRUB_CMDLINE_LINUX_DEFAULT，添加：
   GRUB_CMDLINE_LINUX_DEFAULT="... transparent_hugepage=never"
   sudo update-grub
   sudo reboot
   ```
