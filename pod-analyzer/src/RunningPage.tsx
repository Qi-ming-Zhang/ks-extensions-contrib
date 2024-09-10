import React, { useEffect, useState } from 'react';
import { usePodContext } from './PodContext';
import { Ollama } from "@langchain/community/llms/ollama";
import ReactMarkdown from 'react-markdown';

const llm = new Ollama({
    baseUrl: "http://localhost:11434", 
    model: "qwen2:7b",
});

const RunningPage = () => {
    const { runningPods } = usePodContext();

    const [analysisResult, setAnalysisResult] = useState<string>(
        localStorage.getItem('runningAnalysisResult') || ''
    );
    
    const [lastPods, setLastPods] = useState(
        JSON.parse(localStorage.getItem('lastrunningPods') || '[]')
    );

    useEffect(() => {
        const arePodsEqual = (pods1: any[], pods2: any[]) => {
            if (pods1.length !== pods2.length) return false;
            return pods1.every((pod, index) => pod.name === pods2[index].name );
        };

        const analyzePods = async () => {
            
            if (runningPods.length === 0) {
                setAnalysisResult("No Running pods found.");
                localStorage.setItem('runningAnalysisResult', "No Running pods found.");
                return;
            }
            
            if (arePodsEqual(runningPods, lastPods)) {
                return;
            }

            const podDetails = runningPods.map(pod => `
                Pod 名称: ${pod.name}
                节点名称: ${pod.nodeName}
                Pod IP: ${pod.podIP}
                更新时间: ${new Date(pod.updateTime).toLocaleString()}
            `).join('\n');

            const prompt = `
请你作为 Kubernetes 集群管理员，基于给定信息，从整体上分析以下处于 Running 状态的 Pod。请提供以下信息：
1. 资源分析：
   - 资源请求和资源限制是否合理，是否存在过度或不足的情况。
2. 节点分布：
   - 节点分布是否均衡，是否有单点过载的风险。
3. 镜像情况：
   - 镜像版本是否最新，是否存在已知的安全漏洞或性能问题。
4. 网络配置：
   - 网络配置是否正常，是否存在 IP 冲突或网络隔离问题。

以下是待分析的 Pod 信息：
${podDetails}

请确保输出简洁明了，并以专业的格式呈现。输出参考如下，请勿输出其他无用信息
   - 资源分析： 所有 Pod 的资源请求和限制都合理，没有过度或不足的情况。
   - 节点分布： 节点分布均衡，没有单点过载的风险。
   - 镜像情况： 所有 Pod 的镜像版本都不是最新版本，建议升级到最新的稳定版本以避免已知的安全漏洞或性能问题。
   - 网络配置： 网络配置正常，没有 IP 冲突或网络隔离问题。

            `;

            try {

                const response = await llm.invoke(prompt);
                setAnalysisResult(response);
                setLastPods(runningPods);
                localStorage.setItem('runningAnalysisResult', response);
                localStorage.setItem('lastrunningPods', JSON.stringify(runningPods));

            } catch (error) {

                console.error("Error invoking LLM:", error);
                setAnalysisResult("Error analyzing pods. Please try again later.");

            }
        };

        analyzePods();
    }, [runningPods, lastPods]);

    return (
        <div 
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column', 
                width: '100%', 
                padding: '24px' 
            }}
        >
            <hr 
                style={{ 
                    width: '100%', 
                    border: 'none', 
                    borderTop: '2px dashed black', 
                    marginBottom: '36px' 
                }} 
            />
            <h2>More Info About Running Pods</h2>
            <div 
                style={{ 
                    backgroundColor: 'rgb(227, 233, 233)', 
                    borderRadius: '1.25rem', 
                    padding: '16px', 
                    width: '100%', 
                    maxWidth: '1150px', 
                    margin: '36px auto' ,
                }}
            >
                <h2 
                    style={{ 
                        marginBottom: '16px', 
                        fontSize: '18px', 
                        textAlign: 'left' 
                    }}
                >
                    Detail of Running Pods
                </h2>
                <div 
                    style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '1rem', 
                        padding: '20px', 
                        width: '100%', 
                        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)' 
                    }}
                >
                    {runningPods.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>#</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Node</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Pod IP</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Update Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {runningPods.map((pod, index) => (
                                    <tr key={pod.name}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{pod.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{pod.nodeName}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{pod.podIP}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{new Date(pod.updateTime).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No running pods found.</p>
                    )}
                </div>
            </div>
            <div 
                style={{ 
                    backgroundColor: 'rgb(227, 233, 233)', 
                    borderRadius: '1.25rem', 
                    padding: '16px', 
                    width: '100%', 
                    maxWidth: '1150px', 
                    margin: '5px auto' ,
                }}
            >
                <h2 
                    style={{ 
                        marginBottom: '16px', 
                        fontSize: '18px', 
                        textAlign: 'left' 
                    }}
                >
                    Analysis by LLMs
                </h2>
                <div 
                    style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '1rem', 
                        padding: '20px', 
                        width: '100%', 
                        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)' 
                    }}
                >
                     {analysisResult ? (
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    ) : (
                        <p>Loading analysis...Please wait</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RunningPage;
