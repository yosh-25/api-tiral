import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined"
            }
        }
    }
});

export default theme;
