import React, { useEffect, useState } from 'react';
import { usePodContext } from './PodContext';
import { Ollama } from "@langchain/community/llms/ollama";
import ReactMarkdown from 'react-markdown';

const llm = new Ollama({
    baseUrl: "http://localhost:11434", 
    model: "qwen2:7b",
});

const FailedPage = () => {
    const { failedPods } = usePodContext();

    const [analysisResult, setAnalysisResult] = useState<string>(
        localStorage.getItem('failedAnalysisResult') || ''
    );

    const [lastPods, setLastPods] = useState(
        JSON.parse(localStorage.getItem('lastFailedPods') || '[]')
    );

    useEffect(() => {
        const arePodsEqual = (pods1: any[], pods2: any[]) => {
            if (pods1.length !== pods2.length) return false;
            return pods1.every((pod, index) => pod.name === pods2[index].name);
        };

        const analyzePods = async () => {

            if (failedPods.length === 0) {
                setAnalysisResult("No Failed pods found.");
                localStorage.setItem('failedAnalysisResult', "No Failed pods found.");
                return;
            }

            if (arePodsEqual(failedPods, lastPods)) {
                return;
            }

            const podDetails = failedPods.map(pod => `
                Pod 名称: ${pod.name}
                节点名称: ${pod.nodeName}
                Pod IP: ${pod.podIP}
                更新时间: ${new Date(pod.updateTime).toLocaleString()}
            `).join('\n');

            const prompt = `
作为 Kubernetes 集群管理员，请逐一分析以下处于 Failed 状态的 Pod。请提供以下信息：
1. 失败原因：
   - Pod 失败的具体原因，如资源耗尽、镜像拉取失败等。
   - 请简明扼要地描述发现的问题或确认正常。
2. 容器日志：
   - 容器日志中是否有相关错误信息，帮助定位问题。
   - 请简明扼要地描述发现的问题或确认正常。
3. 事件记录：
   - 事件记录中是否有提示信息，帮助理解失败的原因。
   - 请简明扼要地描述发现的问题或确认正常。
4. 修复措施：
   - 可能的修复措施，如调整资源请求、更新镜像版本、修复网络配置等。
   - 请简明扼要地描述建议的修复措施。

以下是待分析的 Pod 信息：
${podDetails}

请确保输出简洁明了，并以合理且专业的格式呈现。按pod逐一参考如下输出，请勿输出其他无用信息
- 失败原因：Pod 内的容器频繁崩溃并重启，可能是由于应用程序内部错误或配置问题导致的。
- 容器日志：查看容器日志，容器日志中可能包含应用程序崩溃的详细错误信息，例如未处理的异常、配置文件缺失等。
- 事件检查： 查看事件记录，事件记录中可能包含关于容器崩溃的更多上下文信息，例如启动失败的原因。
- 修复措施：检查并修复应用程序代码中的错误。确保所有必要的配置和依赖项都已正确设置。如果应用程序依赖外部服务，确保这些服务可用且配置正确。调整资源请求和限制，确保容器有足够的资源运行。
            `;

            try {

                const response = await llm.invoke(prompt);
                setAnalysisResult(response);
                setLastPods(failedPods);
                localStorage.setItem('failedAnalysisResult', response);
                localStorage.setItem('lastfailedPods', JSON.stringify(failedPods));

            } catch (error) {

                console.error("Error invoking LLM:", error);
                setAnalysisResult("Error analyzing pods. Please try again later.");

            }
        };

        analyzePods();
    }, [failedPods, lastPods]);

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
            <h2>More Info About Failed Pods</h2>
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
                Detail of Failed Pods
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
                {failedPods.length > 0 ? (
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
                        {failedPods.map((pod, index) => (
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
                    <p>No Failed pods found.</p>
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

export default FailedPage;
