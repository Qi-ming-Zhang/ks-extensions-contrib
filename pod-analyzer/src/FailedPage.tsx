import React from 'react';

const FailedPage = () => (
    <div 
        style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            width: '700%', 
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
                <p>Detail Information of Failed Pods ...</p>
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
                <p>Analysis About Failed Pods ...</p>
            </div>
        </div>
    </div>
);

export default FailedPage;


