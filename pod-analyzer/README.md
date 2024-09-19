# Pod Status Analysis Tool

## ![image1](.\image\image1.png)

## Project Overview

Welcome to the Pod Status Analysis Tool project! This project aims to develop a lightweight analysis extension component based on LangChainand Ollama, enabling seamless Pod status monitoring and analysis within KubeSphere cloud. 

## Features

- **Real-time Data Retrieval and Analysis**: real-time monitoring and data analysis of Pod status.
- **Seamless Integration**: Integrate the analysis tool into KubeSphere's existing observation pages for a consistent user experience.
- **Intuitive Frontend Interface**: Designed with React and LangChain for user-friendly interaction.

|        Running Status         |        Pending Status         |
| :---------------------------: | :---------------------------: |
| ![image2](.\image\image2.png) | ![image4](.\image\image4.png) |
| ![image3](.\image\image3.png) | ![image5](.\image\image5.png) |

## Quick Start

- **Install the Kubesphere extension component environment**

  **1、Set up a Kubernetes cluster**

  ```
  export KKZONE=cn
  curl -sfL https://get-kk.kubesphere.io | sh -
  ./kk create cluster --with-local-storage  --with-kubernetes v1.25.3 --container-manager containerd  -y
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

  **2、Install the KubeSphere Luban Helm Chart**

  ```
  helm upgrade --install -n kubesphere-system --create-namespace ks-core  https://charts.kubesphere.io/main/ks-core-1.1.0.tgz --set apiserver.nodePort=30881 --debug --wait
  ```

  **3、Install the tools required for extensions**

  ```
  curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
  sudo apt-get install -y nodejs
  npm install --global yarn
  ```

- **Set up the runtime environment for LLM**

  **1、Install Ollama**

  ```
  pip install modelscope
  modelscope download --model=modelscope/ollama-linux --local_dir ./ollama-linux --revision v0.3.10
  cd ollama-linux
  sudo chmod 777 ./ollama-modelscope-install.sh
  ./ollama-modelscope-install.sh
  ```

  **2、download the Qwen2:7b mode**

  ```
  ollama pull qwen2:7b
  ```

- **Create and deploy this project**

  **1、Initialize extension component**

  ```
  mkdir -p ~/kubesphere-extensions
  cd ~/kubesphere-extensions
  yarn add global create-ks-project
  yarn create ks-project ks-console
  cd ks-console
  yarn create:ext
  
  Extension Name pod-analyzer
  Display Name pod-analyzer
  Description pod analyzer
  Author demo
  Language TypeScript
  Create extension [pod-analyzer]? Yes
  ```

  **2、Clone this repository and add or replace the files under ks-console/extensions/pod-analyzer/src**

  **3、Install the dependencies required for this project**

  ```
  yarn add @langchain/community -W
  yarn add react-markdown -W
  ```

  **4、Modify the configuration file**

  Modify the ks-console/configs/config.yaml according to the actual situation.

  **5、Run the extension component and view it in the browser**

  ```
  yarn dev
  ```

  Open your browser and visit `http://localhost:8000`.

## Contact Us

- For any questions or suggestions, please reach out via the issues page.

- Thank you for your interest and support in the Pod Status Analysis Tool project!
