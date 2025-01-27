import { useEffect, useState } from 'react'

export default function Alert({ message }: { message: string }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false)

  useEffect(() => {
    setIsAlertVisible(true)

    setTimeout(() => {
      setIsAlertVisible(false)
    }, 2000)
  }, [])

  return (
    <>
      {isAlertVisible && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#CC474C',
            padding: '20px 0',
          }}
        >
          <span style={{ textAlign: 'center', color: 'white' }}>{message}</span>
        </div>
      )}
    </>
  )
}
