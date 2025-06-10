import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    scrollContent: {
        padding: 16,
    },
    backButton: {
        backgroundColor: "#1e293b",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#f1f5f9',
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 24,
    },
    title: {
        color: "#f1f5f9",
        fontSize: 32,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: 16,
        marginTop: 4,
    },
    menuItem: {
        backgroundColor: '#1e293b',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuItemIcon: {
        marginRight: 16,
    },
    menuItemTextContainer: {
        flex: 1,
    },
    menuItemTitle: {
        color: '#f1f5f9',
        fontSize: 18,
        fontWeight: '600',
    },
    menuItemSubtitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 2,
    },
    arrowIcon: {
        color: '#94a3b8',
    }
});

export default styles;