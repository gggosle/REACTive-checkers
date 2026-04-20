import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GameContainer} from "./components/GameContainer.tsx";
import './styles/reset.css'
import './styles/style.css'
import { OpenAPI } from './api';
OpenAPI.BASE = 'http://localhost:8000';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameContainer />
  </StrictMode>,
)
