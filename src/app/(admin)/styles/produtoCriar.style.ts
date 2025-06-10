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
    inputMultiline: { 
        minHeight: 100, 
        textAlignVertical: 'top' 
    },
    imagePicker: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 180, 
        backgroundColor: '#1e293b', 
        borderWidth: 2, 
        borderColor: '#334155', 
        borderStyle: 'dashed', 
        borderRadius: 8, 
        marginBottom: 16, 
        overflow: 'hidden' 
    },
    imagePickerText: { 
        color: '#94a3b8' 
    },
    imagePreview: { 
        width: '100%', 
        height: '100%' 
    },
    partsContainer: { 
        marginTop: 24 
    },
    partItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#1e293b' 
    },
    partCheckbox: { 
        width: 24, 
        height: 24, 
        borderRadius: 4, 
        borderWidth: 2, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    partName: { 
        color: '#f1f5f9', 
        fontSize: 16 
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
        marginVertical: 10 
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#0f172a' 
    }
});

export default styles;