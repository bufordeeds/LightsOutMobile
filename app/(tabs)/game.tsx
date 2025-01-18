import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	useColorScheme
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import LightsOutGame from '../../components/LightsOutGame';

export default function GameScreen() {
	const systemColorScheme = useColorScheme();
	const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

	const toggleTheme = useCallback(() => {
		setIsDark((prev) => !prev);
	}, []);

	return (
		<View style={[styles.container, isDark && styles.containerDark]}>
			<View style={styles.header}>
				<Text style={[styles.title, isDark && styles.textDark]}>
					Lights Out
				</Text>
				<TouchableOpacity
					onPress={toggleTheme}
					style={[
						styles.themeButton,
						isDark && styles.themeButtonDark
					]}
				>
					<MaterialCommunityIcons
						name={isDark ? 'weather-sunny' : 'weather-night'}
						size={24}
						color={isDark ? '#FFD700' : '#666'}
					/>
				</TouchableOpacity>
			</View>
			<LightsOutGame isDark={isDark} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 20,
		backgroundColor: '#fff'
	},
	containerDark: {
		backgroundColor: '#121212'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 20,
		marginBottom: 20
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000'
	},
	textDark: {
		color: '#fff'
	},
	themeButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: '#f0f0f0'
	},
	themeButtonDark: {
		backgroundColor: '#333'
	}
});
