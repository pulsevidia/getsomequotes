import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';

import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasicAppShell from "./pages/AppShell";
import Home from "./pages/Home";
import UploadBook from "./pages/UploadBook";
import Uploaded from "./pages/Uploaded/Uploaded";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Quotes from "./pages/Quotes";
import ReadBlog from "./pages/ReadBlog";

const theme = createTheme({
  fontFamily: "Verdana, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Greycliff CF, sans-serif" },
});

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient} defaultColorScheme="dark">
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BasicAppShell />}>
              <Route path="home" element={<Home />} />
              <Route path="upload_book" element={<UploadBook />} />
              <Route path="uploaded" element={<Uploaded />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="blog/:id" element={<ReadBlog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
