/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode } from 'react';

// project-imports
import config from '../config';
import useLocalStorage from '../hooks/useLocalStorage';

// types
import {
  CustomizationProps,
  FontFamily,
  I18n,
  MenuOrientation,
  PresetColor,
  ThemeDirection,
  ThemeMode,
} from '../types/config';

// initial state
const initialState: CustomizationProps = {
  ...config,
  onChangeContainer: () => {},
  onChangeLocalization: (lang: I18n) => {},
  onChangeMode: (mode: ThemeMode) => {},
  onChangePresetColor: (theme: PresetColor) => {},
  onChangeDirection: (direction: ThemeDirection) => {},
  onChangeMiniDrawer: (miniDrawer: boolean) => {},
  onChangeMenuOrientation: (menuOrientation: MenuOrientation) => {},
  onChangeMenuCaption: () => {},
  onChangeFontFamily: (fontFamily: FontFamily) => {},
  onChangeContrast: () => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [configFromLocalStorage, setConfig] = useLocalStorage(
    'sns_conquestor-config',
    initialState
  );

  const onChangeContainer = () => {
    setConfig({
      ...configFromLocalStorage,
      container: !config.container,
    });
  };

  const onChangeLocalization = (lang: I18n) => {
    setConfig({
      ...configFromLocalStorage,
      i18n: lang,
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...configFromLocalStorage,
      mode,
    });
  };

  const onChangePresetColor = (theme: PresetColor) => {
    setConfig({
      ...configFromLocalStorage,
      presetColor: theme,
    });
  };

  const onChangeDirection = (direction: ThemeDirection) => {
    setConfig({
      ...configFromLocalStorage,
      themeDirection: direction,
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...configFromLocalStorage,
      miniDrawer,
    });
  };

  const onChangeContrast = () => {
    setConfig({
      ...configFromLocalStorage,
      themeContrast: !configFromLocalStorage.themeContrast,
    });
  };

  const onChangeMenuCaption = () => {
    setConfig({
      ...configFromLocalStorage,
      menuCaption: !configFromLocalStorage.menuCaption,
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...configFromLocalStorage,
      menuOrientation: layout,
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...configFromLocalStorage,
      fontFamily,
    });
  };

  return (
    <ConfigContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...configFromLocalStorage,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeMenuCaption,
        onChangeFontFamily,
        onChangeContrast,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigContext, ConfigProvider };
