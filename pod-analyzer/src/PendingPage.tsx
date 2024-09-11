import React, { useEffect, useState } from 'react';
import { usePodContext } from './PodContext';
import { Ollama } from "@langchain/community/llms/ollama";
import ReactMarkdown from 'react-markdown';

const llm = new Ollama({
    baseUrl: "http://localhost:11434", 
    model: "qwen2:7b",
});

const PendingPage = () => {
    const { pendingPods } = usePodContext();

    const [analysisResult, setAnalysisResult] = useState<string>(
        localStorage.getItem('pendingAnalysisResult') || ''
    );

    const [lastPods, setLastPods] = useState(
        JSON.parse(localStorage.getItem('lastPendingPods') || '[]')
    );
    

    useEffect(() => {
        const arePodsEqual = (pods1: any[], pods2: any[]) => {
            if (pods1.length !== pods2.length) return false;
            return pods1.every((pod, index) => pod.name === pods2[index].name);
        };
    
        const analyzePods = async () => {
            console.log(pendingPods.length);
            if (pendingPods.length === 0) {
                setAnalysisResult("No Pending pods found.");
                localStorage.setItem('pendingAnalysisResult', "No Pending pods found.");
                return;
            }
    
            if (arePodsEqual(pendingPods, lastPods)) {
                return;
            }
    
            const podDetails = pendingPods.map(pod => `
                Pod 名称: ${pod.name}
                节点名称: ${pod.nodeName}
                Pod IP: ${pod.podIP}
                更新时间: ${new Date(pod.updateTime).toLocaleString()}
            `).join('\n');
    
            const prompt = `
请你作为 Kubernetes 集群管理员，逐一分析以下处于 Pending 状态的 Pod。请提供以下信息：
1. 调度失败原因：
    - 调度失败的具体原因，如资源不足、节点不可用等。
    - 请引用相关日志或事件。
2. 资源分析：
    - 资源请求和资源限制是否合理，是否与集群的资源分配策略冲突。
    - 请描述发现的问题并提供具体的改进建议。
3. 节点容量：
    - 节点容量是否充足，是否需要扩容或调整资源分配策略。
    - 请描述发现的问题并提供数据支持的建议。
4. 其他因素：
    - 是否存在其他影响调度的因素，如网络配置、节点标签等。
    - 请描述发现的问题或确认正常。
        
以下是待分析的 Pod 信息：
${podDetails}
        
请确保输出简洁明了，并以合理且专业的格式呈现。按pod逐一参考如下输出，请勿输出其他无用信息
- 调度失败原因：需要检查 XXX 的输出，特别是调度器的事件日志。若事件日志显示资源不足（如 CPU 或内存），则可能是集群中没有足够的资源来满足 Pod 的请求。
- 资源分析：资源请求和限制都比较低，通常不会与集群的资源分配策略冲突。确认正常。
- 节点容量：检查集群中是否有节点的剩余资源不足以满足该 Pod 的资源请求。可以通过 XXX 查看节点的资源使用情况。
- 其他因素：检查是否有网络配置问题、节点标签或污点（taints）影响调度。确认正常。
            `;
    
            try {

                const response = await llm.invoke(prompt);
                setAnalysisResult(response);
                setLastPods(pendingPods);
                localStorage.setItem('pendingAnalysisResult', response);
                localStorage.setItem('lastPendingPods', JSON.stringify(pendingPods));

            } catch (error) {

                console.error("Error invoking LLM:", error);
                setAnalysisResult("Error analyzing pods. Please try again later.");

            }
        };
    
        analyzePods();
    }, [pendingPods]);
    

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
            <h2>More Info About Pending Pods</h2>
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
                    Detail of Pending Pods
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
                    {pendingPods.length > 0 ? (
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
                                {pendingPods.map((pod, index) => (
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
                        <p>No Pending pods found.</p>
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

export default PendingPage;