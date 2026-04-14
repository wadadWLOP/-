import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage, DiaryPage, DiaryWritePage, AnniversaryPage, AddAnniversaryPage, EditAnniversaryPage, WishPage, AlbumPage, CheckinPage, FoodDiaryPage, SixFacesPage } from './pages';
import { GlobalCatMenu } from './components/UI';

function App() {
  return (
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
        </Route>
        <Route path="/diary/write" element={<DiaryWritePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;