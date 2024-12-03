'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        <EditorProvider>{children}</EditorProvider>
    </QueryClientProvider>
);

type EditorContextType = {
	editor: true | false;
	setEditor: (editor: true | false) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditorContext = () => {
	const editor = useContext(EditorContext);

	if (editor === undefined || editor === null) {
		throw new Error('useUserContext must be used within a UserProvider')
	}
	return editor;
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
	const [editor, setEditor] = useState(false);

	const value = useMemo(
		() => ({
			editor,
			setEditor
		}),
		[editor],
	);

	return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}