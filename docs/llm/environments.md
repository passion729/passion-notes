---
sidebar_position: 1
---

# NVIDIA Environments
On Ubuntu Server `22.04` / `26.04`
## Driver
[Ubuntu Doc](https://documentation.ubuntu.com/server/how-to/graphics/install-nvidia-drivers/)
:::warning[Disable the open-source `nouveau` driver first!]
```shell
# check the nouveau driver
lsmod | grep nouveau

# if has output, disable it
echo "blacklist nouveau" | sudo tee /etc/modprobe.d/disable-nouveau.conf
echo "options nouveau modeset=0" | sudo tee -a /etc/modprobe.d/disable-nouveau.conf
sudo rmmod nouveau || true
sudo update-initramfs -u
```
:::

:::tip
May need to **disable** the BIOS security boot, otherwise the driver will not be loaded.
:::

```shell
# check the nvidia card
lspci | grep -i nvidia

# check the nvidia driver version
cat /proc/driver/nvidia/version

sudo apt install ubuntu-drivers-common
# check the nvidia driver
# for desktop
sudo ubuntu-drivers list
# for server
sudo ubuntu-drivers list --gpgpu

# install
# for desktop
sudo ubuntu-drivers install nvidia:xxx
# for server
sudo ubuntu-drivers install --gpgpu nvidia:xxx-server

sudo reboot
```

```shell
nvidia-smi
```



## Cuda Toolkit
[NVIDIA Doc](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_network)

```shell
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update

# Use 12.x
sudo apt-get -y install cuda-toolkit-12
```
```shell title="~/.bashrc"
// add
export PATH=/usr/local/cuda-12.x/bin:$PATH
```
```shell
nvcc -V
```


## Container Toolkit
[NVIDIA Doc](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

[USTC NVIDIA mirror](https://mirrors.ustc.edu.cn/help/libnvidia-container.html)

The NVIDIA Container Toolkit is a collection of libraries and utilities enabling users to build and run GPU-accelerated containers.

:::tip
nvidia-container-runtime 和 nvidia-docker 均已停止维护，相关功能完全由 libnvidia-container 替代。
:::

```shell
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
   curl \
   gnupg2
```

```shell
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://mirrors.ustc.edu.cn/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://nvidia.github.io#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://mirrors.ustc.edu.cn#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

```shell
sudo apt update && sudo apt install nvidia-container-toolkit
```

```shell
# configuring Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# test
docker info | grep Runtimes
sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```