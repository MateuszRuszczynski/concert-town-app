//#region imports
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { ThemeProvider } from './contexts/ThemeProvider';
import { SignIn } from './pages/SignIn';
import { Terms } from './pages/Terms';
//#endregion

function App () {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/sign-in' replace />} />

          <Route path='/terms' element={<Terms />} />

          <Route path='/sign-in' element={<SignIn />} />

          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
