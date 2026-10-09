//#region imports
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Terms } from './pages/Terms';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Calendar } from './pages/Calendar';
import { NewEvent } from './pages/NewEvent';
import { ThemeProvider } from './contexts/ThemeContext';
import { EventsProvider } from './contexts/EventContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/ui/NotificationContainer/NotificationContainer';
import { EventPage } from './pages/EventPage';
import { EditEvent } from './pages/EditEvent';
import { EventParticipants } from './pages/EventParticipants';
import { CategoriesProvider } from './contexts/CategoriesContext/CategoriesProvider';
import { RegistrationsProvider } from './contexts/RegistrationsContext/RegistrationsProvider';
import { AuthProvider } from './contexts/AuthContext';
import { MyEvents } from './pages/MyEvents';
import { MyRegistrations } from './pages/MyRegistrations';
import { OrganizerRequestsProvider } from './contexts/OrganizerContext/OrganizerRequestsProvider';
import { OrganizerRequests } from './pages/OrganizerRequests';
import { MyOrganizerRequests } from './pages/MyOrganizerRequests';
import { NotFound } from './pages/NotFoundPage/NotFoundPage';
//#endregion

function App () {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CategoriesProvider>
          <EventsProvider>
            <RegistrationsProvider>
              <NotificationProvider>
                <OrganizerRequestsProvider>
                  <HashRouter>
                    <Routes>
                      <Route path='/' element={<MainLayout />}>
                        <Route
                          index
                          element={<Navigate to='/events' replace />}
                        />
                        <Route path='/dashboard' element={<Dashboard />} />

                        <Route
                          path='/organizer-requests'
                          element={<OrganizerRequests />}
                        />

                        <Route path='/my-organizer-request' element={<MyOrganizerRequests />} />

                        <Route path='/events' element={<Events />} />
                        <Route path='/events/mine' element={<MyEvents />} />
                        <Route
                          path='/events/my-registrations'
                          element={<MyRegistrations />}
                        />
                        <Route path='/events/new' element={<NewEvent />} />
                        <Route path='/events/:id' element={<EventPage />} />
                        <Route
                          path='/events/:id/edit'
                          element={<EditEvent />}
                        />
                        <Route
                          path='/events/:id/participants'
                          element={<EventParticipants />}
                        />

                        <Route path='/calendar' element={<Calendar />} />
                      </Route>

                      <Route path='/terms' element={<Terms />} />

                      <Route path='/sign-in' element={<SignIn />} />

                      <Route path='/sign-up' element={<SignUp />} />

                       <Route path="*" element={<NotFound />} />
                    </Routes>
                  </HashRouter>
                  <NotificationContainer />
                </OrganizerRequestsProvider>
              </NotificationProvider>
            </RegistrationsProvider>
          </EventsProvider>
        </CategoriesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
