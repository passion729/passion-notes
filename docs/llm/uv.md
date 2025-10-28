---
sidebar_position: 1
---

# uv
[uv Doc](https://docs.astral.sh/uv/)

## Installation
[Installation Doc](https://docs.astral.sh/uv/getting-started/installation/)
```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## USTC mirror
[USTC mirror](https://mirrors.ustc.edu.cn/help/pypi.html#astral-uv)

```shell title="~/.config/uv/uv.toml"
[[index]]
url = "https://mirrors.ustc.edu.cn/pypi/simple"
default = true
```

## Usage
```shell
# init project
uv init project-name --python 3.xx
cd project-name
uv venv --seed

# add dependency
uv add xxx

# install directly to venv, will not be managed by uv 
# and will not be added to pyproject.toml
uv pip install xxx

# run
uv run xxx.py

# activate venv
source .venv/bin/activate
# deactivate venv
deactivate
```

## Jupyter
[Using uv with Jupyter](https://docs.astral.sh/uv/guides/integration/jupyter/)
```shell
#Add ipykernel as a dev dependency.
uv add --dev ipykernel
uv pip install jupyterlab
.venv/bin/jupyter lab
```

## PyTorch
[Using uv with PyTorch](https://docs.astral.sh/uv/guides/integration/pytorch/)

PyTorch would be installed from PyPI, which hosts CPU-only wheels for Windows and macOS, and GPU-accelerated wheels on Linux (targeting CUDA 12.6)

```shell
uv add torch torchvision
```

## FastAPI
[Using uv with FastAPI](https://docs.astral.sh/uv/guides/integration/fastapi/)

```shell
uv add fastapi --extra standard

uv run fastapi dev
```

```dockerfile title="Dockerfile"
# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . /app

# Install the application dependencies.
WORKDIR /app
RUN uv sync --frozen --no-cache

# Run the application.
CMD ["/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]
```
