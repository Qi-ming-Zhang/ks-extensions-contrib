import React, { useEffect, useState } from 'react';

interface Pod {
    name: string;
    nodeName: string;
    podIP: string;
    updateTime: string;
}

const PendingPage = () => {
    const [pendingPods, setPendingPods] = useState<Pod[]>([]);

    useEffect(() => {
        const fetchPendingPods = async () => {
            try {
                const response = await fetch('/api/v1/pods');
                const data = await response.json();

                const pendingPodsData = data.items
                    .filter((pod: any) => pod.status.phase === 'Pending')
                    .map((pod: any) => ({
                        name: pod.metadata.name,
                        nodeName: pod.spec.nodeName || 'Not scheduled',
                        podIP: pod.status.podIP || 'N/A',
                        updateTime: pod.metadata.creationTimestamp,
                    }));

                setPendingPods(pendingPodsData);
            } catch (error) {
                console.error('Failed to fetch pending pods:', error);
            }
        };

        fetchPendingPods();
    }, []);

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
                        <p>No pending pods found.</p>
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
                    <p>Analysis About Pending Pods ...</p>
                </div>
            </div>
        </div>
    );
};

export default PendingPage;

