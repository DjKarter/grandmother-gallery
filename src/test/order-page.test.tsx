import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { OrderPage } from '../pages/order-page';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderForm = () => render(<MemoryRouter><OrderPage /></MemoryRouter>);

describe('Форма заказа', () => {
  it('показывает читаемую ошибку email и убирает её после исправления', async () => {
    const user = userEvent.setup();
    renderForm();
    const email = screen.getByLabelText('Email');
    await user.type(email, 'bad-email');
    expect(email).toHaveAccessibleDescription('Введите корректный email');
    expect(screen.getByText('Введите корректный email')).toBeVisible();
    expect(screen.queryByText(/invalid_format|"origin"|"pattern"/)).not.toBeInTheDocument();
    await user.clear(email);
    await user.type(email, 'anna@example.com');
    expect(email).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Введите корректный email')).not.toBeInTheDocument();
  });

  it('блокирует буквы и знаки и очищает вставленный телефон', async () => {
    const user = userEvent.setup();
    renderForm();
    const phone = screen.getByLabelText('Телефон *');
    await user.type(phone, 'abcАБВ+()-79991234567');
    expect(phone).toHaveValue('79991234567');
    await user.clear(phone);
    await user.paste('+7 (999) 123-45-67 abc');
    expect(phone).toHaveValue('79991234567');
    fireEvent.change(phone, { target: { value: 'abc123' } });
    expect(phone).toHaveValue('123');
    expect(phone).toHaveAttribute('aria-invalid', 'true');
  });

  it('не отправляет неверные данные и фокусирует первое поле с ошибкой', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Отправить заказ' }));
    expect(screen.getByLabelText('Ваше имя *')).toHaveFocus();
    expect(screen.getByText('Введите имя (минимум 2 символа)')).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('отправляет нормализованные данные и показывает подтверждение', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    renderForm();
    fireEvent.change(screen.getByLabelText('Ваше имя *'), { target: { value: ' Анна ' } });
    fireEvent.change(screen.getByLabelText('Телефон *'), { target: { value: '+7 (999) 123-45-67' } });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить заказ' }));
    expect(await screen.findByText('Спасибо за заказ!')).toBeVisible();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ Имя: 'Анна', Телефон: '79991234567', Email: '' });
  });

  it('показывает понятную ошибку сервиса и позволяет повторить отправку', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);
    renderForm();
    fireEvent.change(screen.getByLabelText('Ваше имя *'), { target: { value: 'Анна' } });
    fireEvent.change(screen.getByLabelText('Телефон *'), { target: { value: '79991234567' } });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить заказ' }));
    expect(screen.getByRole('button', { name: 'Отправляем…' })).toBeDisabled();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось отправить. Попробуйте позже.');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Отправить заказ' })).toBeEnabled());
    expect(screen.getByLabelText('Ваше имя *')).toHaveValue('Анна');
  });
});
