import React, { useState, useCallback, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const GRID_SIZE = 5;
const INITIAL_MOVES = 10; // Number of random moves to generate puzzle

// Calculate cell size based on screen width
const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 60) / GRID_SIZE); // 60 = padding + gaps

interface LightsOutGameProps {
	isDark: boolean;
}

const LightsOutGame = ({ isDark }: LightsOutGameProps) => {
	// Create an empty grid
	function createEmptyGrid() {
		return Array(GRID_SIZE)
			.fill(null)
			.map(() => Array(GRID_SIZE).fill(false));
	}

	// Toggle lights at position and adjacent positions
	const toggleLights = useCallback(
		(currentGrid: boolean[][], row: number, col: number) => {
			const newGrid = currentGrid.map((arr) => [...arr]);

			// Toggle clicked position
			newGrid[row][col] = !newGrid[row][col];

			// Toggle adjacent positions
			const adjacent = [
				[row - 1, col], // up
				[row + 1, col], // down
				[row, col - 1], // left
				[row, col + 1] // right
			];

			adjacent.forEach(([r, c]) => {
				if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
					newGrid[r][c] = !newGrid[r][c];
				}
			});

			return newGrid;
		},
		[]
	);

	// Create initial grid with random but solvable puzzle
	const createInitialGrid = useCallback(() => {
		let newGrid = createEmptyGrid();

		// Make random moves to create puzzle
		for (let i = 0; i < INITIAL_MOVES; i++) {
			const row = Math.floor(Math.random() * GRID_SIZE);
			const col = Math.floor(Math.random() * GRID_SIZE);
			newGrid = toggleLights(newGrid, row, col);
		}

		return newGrid;
	}, [toggleLights]);

	// Game state
	const [grid, setGrid] = useState(createInitialGrid);
	const [moves, setMoves] = useState(0);
	const [hasWon, setHasWon] = useState(false);

	// Handle cell press
	const handleCellPress = useCallback(
		(row: number, col: number) => {
			if (hasWon) return;

			// Trigger haptic feedback
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			setGrid((currentGrid) => toggleLights(currentGrid, row, col));
			setMoves((prev) => prev + 1);
		},
		[hasWon, toggleLights]
	);

	// Reset game
	const resetGame = useCallback(() => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setGrid(createInitialGrid());
		setMoves(0);
		setHasWon(false);
	}, [createInitialGrid]);

	// Check for win condition
	useEffect(() => {
		const allLightsOut = grid.every((row) => row.every((cell) => !cell));
		if (allLightsOut && moves > 0) {
			setHasWon(true);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		}
	}, [grid, moves]);

	return (
		<View style={[styles.container, isDark && styles.containerDark]}>
			{/* Game header */}
			<View style={styles.header}>
				<Text style={[styles.movesText, isDark && styles.textDark]}>
					Moves: {moves}
				</Text>
				<TouchableOpacity
					onPress={resetGame}
					style={[
						styles.resetButton,
						isDark && styles.resetButtonDark
					]}
				>
					<MaterialCommunityIcons
						name='refresh'
						size={24}
						color={isDark ? '#fff' : '#333'}
					/>
				</TouchableOpacity>
			</View>

			{/* Game grid */}
			<View style={[styles.grid, isDark && styles.gridDark]}>
				{grid.map((row, rowIndex) => (
					<View key={`row-${rowIndex}`} style={styles.row}>
						{row.map((isLit, colIndex) => (
							<TouchableOpacity
								key={`${rowIndex}-${colIndex}`}
								onPress={() =>
									handleCellPress(rowIndex, colIndex)
								}
								style={[
									styles.cell,
									isLit
										? styles.cellLit
										: [
												styles.cellDark,
												isDark && styles.cellDarkTheme
										  ],
									hasWon && styles.cellDisabled
								]}
								disabled={hasWon}
							>
								<MaterialCommunityIcons
									name='square'
									size={CELL_SIZE * 0.6}
									color={
										isLit
											? '#FFB000'
											: isDark
											? '#444'
											: '#666'
									}
								/>
							</TouchableOpacity>
						))}
					</View>
				))}
			</View>

			{/* Win message */}
			{hasWon && (
				<Text style={[styles.winText, isDark && styles.winTextDark]}>
					You won in {moves} moves!
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	containerDark: {
		backgroundColor: '#121212'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 16
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		maxWidth: CELL_SIZE * GRID_SIZE + 32,
		marginBottom: 24
	},
	movesText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#000'
	},
	textDark: {
		color: '#fff'
	},
	resetButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: '#f0f0f0'
	},
	resetButtonDark: {
		backgroundColor: '#333'
	},
	grid: {
		backgroundColor: '#f0f0f0',
		padding: 12,
		borderRadius: 16
	},
	gridDark: {
		backgroundColor: '#1e1e1e'
	},
	row: {
		flexDirection: 'row'
	},
	cell: {
		width: CELL_SIZE,
		height: CELL_SIZE,
		margin: 4,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 3, // Android shadow
		shadowColor: '#000', // iOS shadow
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	cellLit: {
		backgroundColor: '#FFE082'
	},
	cellDark: {
		backgroundColor: '#E0E0E0'
	},
	cellDarkTheme: {
		backgroundColor: '#2d2d2d'
	},
	cellDisabled: {
		opacity: 0.8
	},
	winText: {
		marginTop: 24,
		fontSize: 24,
		fontWeight: 'bold',
		color: '#4CAF50'
	},
	winTextDark: {
		color: '#66BB6A'
	}
});

export default LightsOutGame;
