//#region imports
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Terms } from './pages/Terms';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Calendar } from './pages/Calendar';
import { NewEvent } from './pages/NewEvent';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/ui/NotificationContainer';
import { EventPage } from './pages/EventPage';
import { EditEvent } from './pages/EditEvent';
import { EventParticipants } from './pages/EventParticipants';
import { AuthProvider } from './contexts/AuthContext';
import { MyEvents } from './pages/MyEvents';
import { MyRegistrations } from './pages/MyRegistrations';
import {
  OrganizerRequests,
  OrganizerRequestsSkeleton
} from './pages/OrganizerRequests';
import {
  MyOrganizerRequests,
  MyOrganizerRequestsSkeleton
} from './pages/MyOrganizerRequests';
import { NotFound } from './pages/NotFoundPage';
import { RequireAccess } from './components/access/RequireAccess';
import { DashboardSkeleton } from './pages/Dashboard';
import { EventsPageSkeleton } from './components/EventsPageLayout';
import { EventFormLayoutSkeleton } from './components/layout/EventFormLayout/EventFormLayoutSkeleton';
import { OrganizerRequiredPage } from './components/access/OrganizerRequiredPage';
import { RequireAdmin } from './components/access/RequireAdmin';
//#endregion

function App () {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <HashRouter>
            <Routes>
              <Route path='/' element={<MainLayout />}>
                <Route index element={<Navigate to='/events' replace />} />

                <Route
                  element={
                    <RequireAccess
                      fallback={<DashboardSkeleton />}
                      unauthenticatedMessage='Sign in to see an overview of your events and activity.'
                    />
                  }
                >
                  <Route path='/dashboard' element={<Dashboard />} />
                </Route>

                <Route
                  element={
                    <RequireAdmin fallback={<OrganizerRequestsSkeleton />} />
                  }
                >
                  <Route
                    path='/organizer-requests'
                    element={<OrganizerRequests />}
                  />
                </Route>

                <Route
                  element={
                    <RequireAccess
                      fallback={<MyOrganizerRequestsSkeleton />}
                      unauthenticatedMessage='Sign in to track your organizer requests.'
                    />
                  }
                >
                  <Route
                    path='/my-organizer-request'
                    element={<MyOrganizerRequests />}
                  />
                </Route>

                <Route path='/events' element={<Events />} />

                <Route
                  element={
                    <RequireAccess
                      fallback={<EventsPageSkeleton />}
                      unauthenticatedMessage='Sign in to manage and track your events.'
                      roleRule={{
                        role: 'organizer',
                        content: (
                          <OrganizerRequiredPage forbiddenMessage='Only organizers can manage events.' />
                        )
                      }}
                    />
                  }
                >
                  <Route path='/events/mine' element={<MyEvents />} />
                </Route>

                <Route
                  element={
                    <RequireAccess
                      fallback={<EventsPageSkeleton />}
                      unauthenticatedMessage="Sign in to see the events you're registered to attend."
                    />
                  }
                >
                  <Route
                    path='/events/my-registrations'
                    element={<MyRegistrations />}
                  />
                </Route>

                <Route
                  element={
                    <RequireAccess
                      fallback={
                        <EventFormLayoutSkeleton
                          backTo='/events'
                          backLabel='Back to events'
                        />
                      }
                      unauthenticatedMessage='Sign in to create an event.'
                      roleRule={{
                        role: 'organizer',
                        content: (
                          <OrganizerRequiredPage forbiddenMessage='You need to be an organizer to create an event.' />
                        )
                      }}
                    />
                  }
                >
                  <Route path='/events/new' element={<NewEvent />} />
                </Route>

                <Route path='/events/:id' element={<EventPage />} />
                <Route path='/events/:id/edit' element={<EditEvent />} />
                <Route
                  path='/events/:id/participants'
                  element={<EventParticipants />}
                />

                <Route path='/calendar' element={<Calendar />} />
              </Route>

              <Route path='/terms' element={<Terms />} />

              <Route path='/sign-in' element={<SignIn />} />

              <Route path='/sign-up' element={<SignUp />} />

              <Route path='*' element={<NotFound />} />
            </Routes>
          </HashRouter>
          <NotificationContainer />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
