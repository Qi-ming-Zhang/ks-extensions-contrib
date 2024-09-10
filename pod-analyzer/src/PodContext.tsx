import React, { createContext, useContext, useState, useEffect } from 'react';

interface Pod {
    name: string;
    nodeName: string;
    podIP: string;
    updateTime: string;
}

interface PodContextType {
    pendingPods: Pod[];
    runningPods: Pod[];
    failedPods: Pod[];
    podStatuses: {
        title: string;
        count: number;
        description: string;
        href: string;
    }[];
}

const PodContext = createContext<PodContextType | undefined>(undefined);

export const PodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pendingPods, setPendingPods] = useState<Pod[]>([]);
    const [runningPods, setRunningPods] = useState<Pod[]>([]);
    const [failedPods, setFailedPods] = useState<Pod[]>([]);
    const [podStatuses, setPodStatuses] = useState<PodContextType['podStatuses']>([]);

    useEffect(() => {
        const fetchPods = async () => {
            try {
                const response = await fetch('/api/v1/pods');
                const data = await response.json();

                const runningPodsData = data.items
                    .filter((pod: any) => pod.status.phase === 'Running')
                    .map((pod: any) => ({
                        name: pod.metadata.name,
                        nodeName: pod.spec.nodeName || 'Unscheduled',
                        podIP: pod.status.podIP || 'N/A',
                        updateTime: pod.metadata.creationTimestamp,
                    }));

                const pendingPodsData = data.items
                    .filter((pod: any) => pod.status.phase === 'Pending')
                    .map((pod: any) => ({
                        name: pod.metadata.name,
                        nodeName: pod.spec.nodeName || 'Unscheduled',
                        podIP: pod.status.podIP || 'N/A',
                        updateTime: pod.metadata.creationTimestamp,
                    }));

                const failedPodsData = data.items
                    .filter((pod: any) => pod.status.phase === 'Failed')
                    .map((pod: any) => ({
                        name: pod.metadata.name,
                        nodeName: pod.spec.nodeName || 'Unscheduled',
                        podIP: pod.status.podIP || 'N/A',
                        updateTime: pod.metadata.creationTimestamp,
                    }));

                setRunningPods(runningPodsData);
                setPendingPods(pendingPodsData);
                setFailedPods(failedPodsData);
                setPodStatuses([
                    { title: 'Running', count: runningPodsData.length, description: 'Pods that are currently in a running state.', href: '/pod-analyzer/running' },
                    { title: 'Pending', count: pendingPodsData.length, description: 'Pods waiting to be scheduled or have unmet dependencies.', href: '/pod-analyzer/pending' },
                    { title: 'Failed', count: failedPodsData.length, description: 'Pods that have failed to complete successfully.', href: '/pod-analyzer/failed' },
                ]);
            } catch (error) {
                console.error('Failed to retrieve Pod status.', error);
            }
        };

        fetchPods();
    }, []);

    return (
        <PodContext.Provider value={{ pendingPods, runningPods, failedPods, podStatuses }}>
            {children}
        </PodContext.Provider>
    );
};

export const usePodContext = () => {
    const context = useContext(PodContext);
    if (!context) {
        throw new Error('usePodContext must be used within a PodProvider.');
    }
    return context;
};
