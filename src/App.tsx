import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage, DiaryPage, DiaryWritePage, AnniversaryPage, AddAnniversaryPage, EditAnniversaryPage, WishPage, AlbumPage, CheckinPage, FoodDiaryPage, SixFacesPage, VisitorLogsPage } from './pages';
import { GlobalCatMenu } from './components/UI';
import { PasswordGate } from './components/PasswordGate';

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <GlobalCatMenu />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="diary" element={<DiaryPage />} />
            <Route path="anniversary" element={<AnniversaryPage />} />
            <Route path="anniversary/add" element={<AddAnniversaryPage />} />
            <Route path="anniversary/edit/:id" element={<EditAnniversaryPage />} />
            <Route path="wish" element={<WishPage />} />
            <Route path="album" element={<AlbumPage />} />
            <Route path="checkin" element={<CheckinPage />} />
            <Route path="food" element={<FoodDiaryPage />} />
            <Route path="six-faces" element={<SixFacesPage />} />
            <Route path="visitor-logs" element={<VisitorLogsPage />} />
          </Route>
          <Route path="/diary/write" element={<DiaryWritePage />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  );
}

export default App;