import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Type definition for Todo
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  category: string;
   dueDate?: string;
};

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React Native', completed: false, category: 'Learning' },
    { id: 2, text: 'Build a todo app', completed: false, category: 'Work' },
    { id: 3, text: 'Master coding', completed: false, category: 'Learning' },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputText, setInputText] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('Personal'); 
  const [selectedDate, setSelectedDate] = useState(''); 
  const categories = ['Personal', 'Work', 'Learning', 'Shopping']; 

  // ===== ASYNCSTORAGE FUNCTIONS =====
  
  // Save todos to storage
  const saveTodos = async (todosToSave: Todo[]) => {
    try {
      const jsonValue = JSON.stringify(todosToSave);
      await AsyncStorage.setItem('todos', jsonValue);
      console.log('✅ Todos saved!');
    } catch (e) {
      console.log('❌ Error saving todos:', e);
    }
  };

  // Load todos from storage
  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      if (jsonValue !== null) {
        const loadedTodos = JSON.parse(jsonValue);
        setTodos(loadedTodos);
        console.log('✅ Todos loaded!');
      }
    } catch (e) {
      console.log('❌ Error loading todos:', e);
    }
  };

  // Save dark mode preference
// Save dark mode preference
    const saveDarkMode = async (isDark: boolean) => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(isDark));
        console.log('✅ Dark mode saved!');
      } catch (e) {
        console.log('❌ Error saving dark mode:', e);
      }
    };

  // Load dark mode preference
  const loadDarkMode = async () => {
    try {
      const value = await AsyncStorage.getItem('darkMode');
      if (value !== null) {
        setIsDarkMode(JSON.parse(value));
        console.log('✅ Dark mode loaded!');
      }
    } catch (e) {
      console.log('❌ Error loading dark mode:', e);
    }
  };

  // ===== USEEFFECT HOOKS =====
  
  // Load data when app starts
  useEffect(() => {
    loadTodos();
    loadDarkMode();
  }, []);

  // Save todos whenever they change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Save dark mode whenever it changes
  useEffect(() => {
    saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  // ===== APP FUNCTIONS =====

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

const addTodo = () => {
  if (inputText.trim() !== '') {
    const newTodo = {
      id: Date.now(),
      text: inputText,
      completed: false,
      category: selectedCategory,
      dueDate: selectedDate || undefined, // ADD THIS
    };
    setTodos([newTodo, ...todos]);
    setInputText('');
    setSelectedDate(''); // Clear date
  }
};

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const clearAll = () => {
    setTodos([]);
  };
  const getCategoryColor = (category: string) => {
  const colors: any = {
    Personal: '#FF9500',
    Work: '#007AFF',
    Learning: '#34C759',
    Shopping: '#FF3B30',
  };
  return colors[category] || '#999';
};

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#090909ff' : '#f5f5f5' }
    ]}>
      {/* Dark Mode Toggle Button */}
      <TouchableOpacity 
        style={styles.darkModeButton} 
        onPress={toggleDarkMode}
      >
        <Text style={styles.darkModeText}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </Text>
      </TouchableOpacity>

      <Text style={[
        styles.title,
        { color: isDarkMode ? '#ffffff' : '#333' }
      ]}>
        My Todo List
      </Text>
      
      <Text style={[
        styles.counter,
        { color: isDarkMode ? '#ffffff' : '#333' }
      ]}>
        You have {todos.filter(t => !t.completed).length} tasks
      </Text>
      
      {/* Clear All Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isDarkMode ? '#1c1c1e' : 'white',
              color: isDarkMode ? '#ffffff' : '#333'
            }
          ]}
          placeholder="✨ What do you need to do?"
          placeholderTextColor={isDarkMode ? '#8e8e93' : '#999'}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selector */}
  <View style={styles.categoryContainer}>
    <Text style={[styles.categoryLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
      Category:
    </Text>
    <View style={styles.categoryButtons}>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryButton,
            { backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5EA' },
            selectedCategory === cat && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(cat)}
        >
          <Text style={[
            styles.categoryButtonText,
            { color: isDarkMode ? '#ccc' : '#666' },
            selectedCategory === cat && { color: 'white' }
          ]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>

      {/* Due Date */}
    <View style={styles.dateContainer}>
      <Text style={[styles.categoryLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
        Due Date (optional):
      </Text>
      <TextInput
        style={[
          styles.dateInput,
          { 
            backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5EA',
            color: isDarkMode ? '#fff' : '#333'
          }
        ]}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={isDarkMode ? '#888' : '#999'}
        value={selectedDate}
        onChangeText={setSelectedDate}
      />
    </View>

      {/* Search Bar */}
      <View style={[
        styles.searchContainer,
        { backgroundColor: isDarkMode ? '#1c1c1e' : 'white' }
      ]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: isDarkMode ? '#1c1c1e' : 'white',
            color: isDarkMode ? '#ffffff' : '#333'
          }]}
          placeholder="Search todos..."
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5EA' },
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: isDarkMode ? '#ccc' : '#666' },
            filter === 'all' && styles.filterButtonTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5EA' },
            filter === 'active' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('active')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: isDarkMode ? '#ccc' : '#666' },
            filter === 'active' && styles.filterButtonTextActive
          ]}>
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5EA' },
            filter === 'completed' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: isDarkMode ? '#ccc' : '#666' },
            filter === 'completed' && styles.filterButtonTextActive
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos
          .filter(todo => {
            const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
            
            if (filter === 'active') {
              return matchesSearch && !todo.completed;
            } else if (filter === 'completed') {
              return matchesSearch && todo.completed;
            } else {
              return matchesSearch;
            }
          })
        }
        renderItem={({ item }) => {
  const scale = new Animated.Value(0);
  
  Animated.spring(scale, {
    toValue: 1,
    friction: 3,
    useNativeDriver: true,
  }).start();
  
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[
        styles.todoItem,
        { backgroundColor: isDarkMode ? '#1c1c1e' : 'white' }
      ]}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => toggleComplete(item.id)}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={[
            styles.todoText,
            { color: isDarkMode ? '#ffffff' : '#333' },
            item.completed && styles.todoTextCompleted
          ]}>
            {item.text}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <View style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) }
            ]}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>

            {item.dueDate && (
              <Text style={[
                styles.dueDateText,
                { color: isDarkMode ? '#888' : '#999' }
              ]}>
                📅 {item.dueDate}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 10,
  },
  counter: {
    fontSize: 18,
    marginLeft: 20,
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 20,        
    borderRadius: 10,
    fontSize: 18,      
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteText: {
    fontSize: 24,
  },
  darkModeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  darkModeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  categoryContainer: {
  marginHorizontal: 20,
  marginBottom: 15,
},
categoryLabel: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 8,
},
categoryButtons: {
  flexDirection: 'row',
  gap: 8,
},
categoryButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 15,
},
categoryButtonActive: {
  backgroundColor: '#007AFF',
},
categoryButtonText: {
  fontSize: 12,
  fontWeight: '600',
},
categoryBadge: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 10,
  marginLeft: 8,
},
categoryBadgeText: {
  color: 'white',
  fontSize: 10,
  fontWeight: 'bold',
},
dateContainer: {
  marginHorizontal: 20,
  marginBottom: 15,
},
dateInput: {
  padding: 10,
  borderRadius: 8,
  fontSize: 14,
},
dueDateText: {
  fontSize: 11,
  marginLeft: 8,
},
});