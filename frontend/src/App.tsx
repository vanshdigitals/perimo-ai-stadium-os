import { AppRouter } from '@/router';
import { AppProvider } from '@/contexts/AppContext';
import { ToastContainer } from '@/components/ui/Toast';

function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
