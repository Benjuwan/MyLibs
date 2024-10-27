export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p style={{ 'textAlign': 'center' }}>&copy; {year} MyLibs by benjuwan</p>
        </footer>
    );
}