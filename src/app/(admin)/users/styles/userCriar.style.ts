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
        paddingHorizontal: 20 
    },
    label: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#cbd5e1', 
        marginBottom: 8, 
        marginTop: 20 
    },
    input: { 
        backgroundColor: '#1e293b', 
        color: '#f1f5f9', 
        borderRadius: 10, 
        padding: 14, 
        fontSize: 16, 
        borderWidth: 1, 
        borderColor: '#334155' 
    },
    inputDisabled: {
        backgroundColor: '#334155',
        color: '#94a3b8',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 20,
    },
    saveButton: { 
        backgroundColor: "#22c55e", 
        padding: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 40 
    },
    saveButtonText: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    deleteButton: { 
        backgroundColor: '#ef4444', 
        padding: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 16 
    },
    deleteButtonText: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    errorText: { 
        color: '#ef4444', 
        textAlign: 'center', 
        marginVertical: 10,
        fontSize: 15
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#0f172a' 
    },
});

export default styles;