export function paginate(items, pageNumber, pageSize) {
  // разбиение на страницы
  const startIndex = (pageNumber - 1) * pageSize
  return [...items].splice(startIndex, pageSize)
}
