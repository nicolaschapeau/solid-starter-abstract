
import './App.css'
import { LoginButton, LogoutButton } from './components/auth_buttons'
import AbstractWalletProvider from './providers/AbstractWalletProvider'

function App() {
  return (
    <AbstractWalletProvider>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Abstract Wallet App</h1>
        </header>
        <main>
          <p>This is a simple app to demonstrate the Abstract Wallet integration.</p>
          {/* Additional components can be added here */}`
          <LoginButton />
          <LogoutButton />
        </main>
      </div>
    </AbstractWalletProvider>
  )
}

export default App
