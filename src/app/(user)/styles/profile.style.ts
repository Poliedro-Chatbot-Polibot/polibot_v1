import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a"
    },
    scrollContent: {
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    backButton: {
        marginRight: 16
    },
    title: {
        color: "#f1f5f9",
        fontSize: 24,
        fontWeight: "700"
    },
    formContainer: {
        padding: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#cbd5e1',
        marginBottom: 8,
        marginTop: 16
    },
    input: {
        backgroundColor: '#1e293b',
        color: '#f1f5f9',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#334155'
    },
    inputRead: {
        backgroundColor: '#1e2931',
        color: '#f1f5f9',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#334155'
    },
    saveButton: {
        backgroundColor: "#22c55e",
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a'
    }
});

export default styles;