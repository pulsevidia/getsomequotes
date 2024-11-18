import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasicAppShell from "./pages/AppShell";
import Home from "./pages/Home";
import UploadBook from "./pages/UploadBook";
import Uploaded from "./pages/Uploaded/Uploaded";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReadBlog from "./pages/ReadBlog";
import Auth from "./pages/Auth";
import { useColorScheme } from "@mantine/hooks";

export default function App() {
  const theme = createTheme({
    fontFamily: "Verdana, sans-serif",
    fontFamilyMonospace: "Monaco, Courier, monospace",
    headings: { fontFamily: "Greycliff CF, sans-serif" },
  });

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BasicAppShell />}>
              <Route path="home" element={<Home />} />
              <Route path="auth" element={<Auth />} />
              <Route path="upload_book" element={<UploadBook />} />
              <Route path="uploaded" element={<Uploaded />} />
              <Route path="blog/:id" element={<ReadBlog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
