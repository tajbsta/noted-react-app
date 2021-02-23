import { Suspense } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './assets/scss/theme.scss';
import AppRouteSwitcher from './routes/AppRouteSwitcher';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div className="loading" />}>
          <Route render={(props) => <AppRouteSwitcher {...props} />} />
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
