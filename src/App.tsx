//#region imports
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { ThemeProvider } from './contexts/ThemeProvider';
import { SignIn } from './pages/SignIn';
import { Terms } from './pages/Terms';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Calendar } from './pages/Calendar';
//#endregion

function App () {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />

            <Route path='/events' element={<Events />} />

            <Route path='/calendar' element={<Calendar />} />
          </Route>

          <Route path='/terms' element={<Terms />} />

          <Route path='/sign-in' element={<SignIn />} />

          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
