import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React Native', completed: false },
    { id: 2, text: 'Build a todo app', completed: false },
    { id: 3, text: 'Master coding', completed: false },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputText,
        completed: false,
      };
      setTodos([newTodo, ...todos]);
      setInputText('');
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

  return (
    // FIXED: Added dynamic background color for dark mode
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

      {/* FIXED: Added dynamic text color for dark mode */}
      <Text style={[
        styles.title,
        { color: isDarkMode ? '#ffffff' : '#333' }
      ]}>
        My Todo List
      </Text>
      
      {/* FIXED: Added dynamic text color for counter */}
      <Text style={[
        styles.counter,
        { color: isDarkMode ? '#ffffff' : '#333' }
      ]}>
        You have {todos.length} tasks
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: isDarkMode ? '#2a2a2a' : 'white',
            color: isDarkMode ? '#ffffff' : '#333'
          }]}
          placeholder="Search todos..."
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      
      {/* Todo List with Checkboxes */}
      <FlatList
        data={todos.filter(todo => 
          todo.text.toLowerCase().includes(searchText.toLowerCase())
        )}
        renderItem={({ item }) => (
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
            
            <Text style={[
              styles.todoText,
              { color: isDarkMode ? '#ffffff' : '#333' },
              item.completed && styles.todoTextCompleted
            ]}>
              {item.text}
            </Text>
            
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
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
  backgroundColor: 'white',
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
});