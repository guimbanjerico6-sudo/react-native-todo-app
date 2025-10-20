import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React Native', completed: false },
    { id: 2, text: 'Build a todo app', completed: false },
    { id: 3, text: 'Master coding', completed: false },
  ]);

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
    <View style={styles.container}>
      <Text style={styles.title}>My Todo List</Text>
      
      {/* CHALLENGE 4: Counter */}
      <Text style={styles.counter}>You have {todos.length} tasks</Text>
      
      {/* CHALLENGE 7: Clear All Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="✨ What do you need to do?"  // CHALLENGE 5
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* CHALLENGE 8: Checkboxes */}
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => toggleComplete(item.id)}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <Text style={[
              styles.todoText,
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 10,
  },
  counter: {
    fontSize: 18,
    color: '#666',
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
    backgroundColor: 'white',
    padding: 20,        // CHALLENGE 6: Bigger
    borderRadius: 10,
    fontSize: 18,       // CHALLENGE 6: Bigger text
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
    backgroundColor: 'white',
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
    color: '#333',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteText: {
    fontSize: 24,
  },
});