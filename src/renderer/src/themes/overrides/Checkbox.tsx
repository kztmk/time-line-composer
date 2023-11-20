// material-ui
// import { CheckboxProps } from '@mui/material';
import { CheckboxPropsSizeOverrides } from '@mui/material/Checkbox';
import { Theme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';

// assets
import { MinusSquare, Stop, TickSquare } from 'iconsax-react';

// project-imports
import getColors from '../../utils/getColors';

// types
import { ThemeMode } from '../../types/config';
import { ExtendedStyleProps } from '../../types/extended';

type CustomCheckboxSize = OverridableStringUnion<
  'small' | 'medium' | 'large',
  CheckboxPropsSizeOverrides
>;
// ==============================|| RADIO - COLORS ||============================== //

function getColorStyle({ color, theme }: ExtendedStyleProps) {
  const colors = getColors(theme, color);
  const { lighter, main, dark } = colors;

  return {
    '&:hover': {
      backgroundColor: color === 'secondary' ? lighter : lighter + 50,
      ...(theme.palette.mode === ThemeMode.DARK && {
        backgroundColor: color === 'secondary' ? lighter + 50 : lighter + 20,
      }),
      '& .icon': {
        borderColor: main,
      },
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${dark}`,
      outlineOffset: -4,
    },
  };
}

// ==============================|| CHECKBOX - SIZE STYLE ||============================== //

interface CheckboxSizeProps {
  size: number;
}

function getSizeStyle(size?: CustomCheckboxSize): CheckboxSizeProps {
  switch (size) {
    case 'small':
      return { size: 20 };
    case 'large':
      return { size: 28 };
    case 'medium':
    default:
      return { size: 24 };
  }
}

// ==============================|| CHECKBOX - STYLE ||============================== //

function checkboxStyle(size?: CustomCheckboxSize) {
  const sizes: CheckboxSizeProps = getSizeStyle(size);

  return {
    '& svg': {
      width: sizes.size,
      height: sizes.size,
    },
  };
}

// ==============================|| OVERRIDES - CHECKBOX ||============================== //

export default function Checkbox(theme: Theme) {
  const { palette } = theme;

  return {
    MuiCheckbox: {
      defaultProps: {
        className: 'size-medium',
        icon: <Stop />,
        checkedIcon: <TickSquare variant="Bold" />,
        indeterminateIcon: <MinusSquare variant="Bold" />,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: palette.secondary[300],
          '&.size-small': {
            ...checkboxStyle('small'),
          },
          '&.size-medium': {
            ...checkboxStyle('medium'),
          },
          '&.size-large': {
            ...checkboxStyle('large'),
          },
        },
        colorPrimary: getColorStyle({ color: 'primary', theme }),
        colorSecondary: getColorStyle({ color: 'secondary', theme }),
        colorSuccess: getColorStyle({ color: 'success', theme }),
        colorWarning: getColorStyle({ color: 'warning', theme }),
        colorInfo: getColorStyle({ color: 'info', theme }),
        colorError: getColorStyle({ color: 'error', theme }),
      },
    },
  };
}
