import { mount, flushPromises } from '@vue/test-utils';
import TodoList from '../TodoList.vue';

jest.mock('../../utils/db', () => ({
  default: {
    getAllTodos: jest.fn(),
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    clearAll: jest.fn()
  }
}));

const db = jest.requireMocked('../../utils/db').default;

describe('TodoList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.confirm = jest.fn(() => true);
  });

  function mountWithTodos(todos) {
    db.getAllTodos.mockResolvedValue(todos);
    return mount(TodoList);
  }

  test('renders the loaded todos', async () => {
    const wrapper = mountWithTodos([{ id: 1, text: 'Buy milk', completed: false }]);
    await flushPromises();

    expect(wrapper.findAll('li').length).toBe(1);
    expect(wrapper.html()).toContain('Buy milk');
    expect(wrapper.vm.todos.length).toBe(1);
  });

  test('shows the empty state when there are no todos', async () => {
    const wrapper = mountWithTodos([]);
    await flushPromises();

    expect(wrapper.html()).toContain('No tasks on your list');
  });

  test('adds a new todo and clears the input', async () => {
    const wrapper = mountWithTodos([]);
    await flushPromises();

    wrapper.setData({ newTodo: 'New task' });
    await wrapper.vm.addTodo();

    expect(db.addTodo).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'New task', completed: false })
    );
    expect(wrapper.vm.todos.length).toBe(1);
    expect(wrapper.vm.newTodo).toBe('');
  });

  test('does not add an empty todo', async () => {
    const wrapper = mountWithTodos([]);
    await flushPromises();

    wrapper.setData({ newTodo: '   ' });
    await wrapper.vm.addTodo();

    expect(db.addTodo).not.toHaveBeenCalled();
  });

  test('toggles a todo and persists the change', async () => {
    const todos = [{ id: 1, text: 'Task', completed: false }];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.toggleTodo(wrapper.vm.todos[0]);

    expect(db.updateTodo).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, completed: true })
    );
    expect(wrapper.vm.todos[0].completed).toBe(true);
  });

  test('rolls back the toggle when persistence fails', async () => {
    const todos = [{ id: 1, text: 'Task', completed: false }];
    db.updateTodo.mockRejectedValue(new Error('db down'));
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.toggleTodo(wrapper.vm.todos[0]);

    expect(wrapper.vm.todos[0].completed).toBe(false);
  });

  test('deletes a todo and removes it from the list', async () => {
    const todos = [{ id: 1, text: 'Keep' }, { id: 2, text: 'Drop' }];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.deleteTodo(2);

    expect(db.deleteTodo).toHaveBeenCalledWith(2);
    expect(wrapper.vm.todos.length).toBe(1);
    expect(wrapper.vm.todos[0].text).toBe('Keep');
  });

  test('clears all todos when the user confirms', async () => {
    const todos = [{ id: 1, text: 'A' }, { id: 2, text: 'B' }];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.clearAll();

    expect(window.confirm).toHaveBeenCalled();
    expect(db.clearAll).toHaveBeenCalled();
    expect(wrapper.vm.todos.length).toBe(0);
  });

  test('does not clear todos when the user declines', async () => {
    window.confirm = jest.fn(() => false);
    const todos = [{ id: 1, text: 'A' }];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.clearAll();

    expect(db.clearAll).not.toHaveBeenCalled();
    expect(wrapper.vm.todos.length).toBe(1);
  });

  test('clears only completed todos', async () => {
    const todos = [
      { id: 1, text: 'Done', completed: true },
      { id: 2, text: 'Pending', completed: false }
    ];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    await wrapper.vm.clearCompleted();

    expect(db.deleteTodo).toHaveBeenCalledWith(1);
    expect(wrapper.vm.todos.length).toBe(1);
    expect(wrapper.vm.todos[0].text).toBe('Pending');
  });

  test('filters todos by status', async () => {
    const todos = [
      { id: 1, text: 'Done', completed: true },
      { id: 2, text: 'Pending', completed: false }
    ];
    const wrapper = mountWithTodos(todos);
    await flushPromises();

    wrapper.setData({ currentFilter: 'completed' });
    expect(wrapper.vm.filteredTodos.length).toBe(1);
    expect(wrapper.vm.filteredTodos[0].text).toBe('Done');

    wrapper.setData({ currentFilter: 'active' });
    expect(wrapper.vm.filteredTodos.length).toBe(1);
    expect(wrapper.vm.filteredTodos[0].text).toBe('Pending');

    wrapper.setData({ currentFilter: 'all' });
    expect(wrapper.vm.filteredTodos.length).toBe(2);
  });
});
