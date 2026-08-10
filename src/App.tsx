//#region imports
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { ThemeProvider } from './contexts/ThemeProvider';
import { SignIn } from './pages/SignIn';
import { Terms } from './pages/Terms';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Calendar } from './pages/Calendar';
import { NewEvent } from './pages/NewEvent';
import { EventsProvider } from './contexts/EventsProvider';
//#endregion

function App () {
  return (
    <ThemeProvider>
      <EventsProvider>
        <HashRouter>
          <Routes>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Navigate to='/events' replace />} />
              <Route path='/dashboard' element={<Dashboard />} />

              <Route path='/events' element={<Events />} />
              <Route path='/events/new' element={<NewEvent />} />

              <Route path='/calendar' element={<Calendar />} />
            </Route>

            <Route path='/terms' element={<Terms />} />

            <Route path='/sign-in' element={<SignIn />} />

            <Route path='/sign-up' element={<SignUp />} />
          </Routes>
        </HashRouter>
      </EventsProvider>
    </ThemeProvider>
  );
}

export default App;
