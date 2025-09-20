import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const [healthStatus, setHealthStatus] = useState<string>('Checking...')
  const [apiUrl] = useState('http://brainsait-nphies-alb-1821626782.us-east-1.elb.amazonaws.com') // Updated with actual ALB endpoint

  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`)
      if (response.ok) {
        const data = await response.json()
        setHealthStatus(`Healthy - ${data.version}`)
      } else {
        setHealthStatus('Unhealthy')
      }
    } catch (error) {
      setHealthStatus('Connection Failed')
    }
  }

  const testChat = async () => {
    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test healthcare query',
          language: 'en'
        })
      })
      
      if (response.ok) {
        alert('Chat API test successful!')
      } else {
        alert('Chat API test failed')
      }
    } catch (error) {
      alert('Chat API connection failed')
    }
  }

  return (
    <>
      <Head>
        <title>BrainSAIT NPHIES-AI Dashboard</title>
        <meta name="description" content="Healthcare AI Dashboard for NPHIES Integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              BrainSAIT NPHIES-AI
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', margin: 0 }}>
              Healthcare AI Middleware Dashboard
            </p>
          </header>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>🏥 System Status</h3>
              <div style={{ marginBottom: '15px' }}>
                <strong>API Health:</strong> 
                <span style={{ 
                  marginLeft: '10px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  background: healthStatus.includes('Healthy') ? '#d4edda' : '#f8d7da',
                  color: healthStatus.includes('Healthy') ? '#155724' : '#721c24',
                  fontSize: '0.9rem'
                }}>
                  {healthStatus}
                </span>
              </div>
              <button 
                onClick={checkApiHealth}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Refresh Status
              </button>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>🤖 AI Chat Interface</h3>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                Test the AG-UI protocol chat endpoint with healthcare queries.
              </p>
              <button 
                onClick={testChat}
                style={{
                  background: '#764ba2',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Test Chat API
              </button>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>📊 NPHIES Integration</h3>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p>✅ FHIR R4 Validation</p>
                <p>✅ Saudi Healthcare Terminology</p>
                <p>✅ Claims Processing</p>
                <p>✅ Bilingual Support (AR/EN)</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>🔧 AWS Infrastructure</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              fontSize: '0.9rem'
            }}>
              <div>
                <strong>🐳 ECS Fargate:</strong><br />
                <span style={{ color: '#666' }}>FastAPI Backend</span>
              </div>
              <div>
                <strong>🗄️ RDS PostgreSQL:</strong><br />
                <span style={{ color: '#666' }}>Healthcare Data</span>
              </div>
              <div>
                <strong>⚡ ElastiCache Redis:</strong><br />
                <span style={{ color: '#666' }}>Session Management</span>
              </div>
              <div>
                <strong>📦 S3 Bucket:</strong><br />
                <span style={{ color: '#666' }}>Medical Images</span>
              </div>
              <div>
                <strong>🌐 AWS Amplify:</strong><br />
                <span style={{ color: '#666' }}>Dashboard Hosting</span>
              </div>
              <div>
                <strong>📊 CloudWatch:</strong><br />
                <span style={{ color: '#666' }}>Monitoring & Logs</span>
              </div>
            </div>
          </div>

          <footer style={{ 
            textAlign: 'center', 
            marginTop: '40px', 
            padding: '20px',
            borderTop: '1px solid #e0e0e0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <p>BrainSAIT Healthcare Technology © 2024</p>
            <p>HIPAA Compliant • NPHIES Integrated • Free Tier Optimized</p>
          </footer>
        </div>
      </div>
    </>
  )
}
