const fs = require('fs');

// Початок вимірювання часу
const startTime = Date.now();

// Функція для пошуку медіани
function findMedian(arr) {
  arr.sort((a, b) => a - b);
  const length = arr.length;

  if (length % 2 === 0) {
    // Якщо кількість елементів парна, знаходимо два середні елементи
    const mid1 = arr[length / 2 - 1];
    const mid2 = arr[length / 2];
    // Повертаємо їх середнє значення
    return (mid1 + mid2) / 2;
  } else {
    // Якщо кількість елементів непарна, повертаємо середній елемент
    return arr[Math.floor(length / 2)];
  }
}

// Читаємо всі числа з файлу
function readNumbersFromFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return data
    .split('\n')
    .map(line => parseInt(line.trim(), 10))
    .filter(Number.isInteger);
}

// Функція для обчислення статистики
function calculateStatistics(numbers) {
  let maxNumber = -Infinity;
  let minNumber = Infinity;
  let sumAll = 0;

  let currentSeqGrowth = [];
  let longSeqGrowth = [];
  let currentSeqDecrease = [];
  let longSeqDecrease = [];

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];

    // Визначення максимального і мінімального значень
    if (num > maxNumber) maxNumber = num;
    if (num < minNumber) minNumber = num;

    // Сумує всі числа
    sumAll += num;

    // Визначення найбільшої послідовності чисел за зростанням
    if (i === 0 || num > numbers[i - 1]) {
      currentSeqGrowth.push(num);
    } else {
      if (currentSeqGrowth.length > longSeqGrowth.length) {
        longSeqGrowth = currentSeqGrowth;
      }
      currentSeqGrowth = [num];
    }

    // Визначення найбільшої послідовності чисел за спаданням
    if (i === 0 || num < numbers[i - 1]) {
      currentSeqDecrease.push(num);
    } else {
      if (currentSeqDecrease.length > longSeqDecrease.length) {
        longSeqDecrease = currentSeqDecrease;
      }
      currentSeqDecrease = [num];
    }
  }

  // Перевірки на випадок, якщо найдовша послідовність йде до кінця списку
  if (currentSeqGrowth.length > longSeqGrowth.length) {
    longSeqGrowth = currentSeqGrowth;
  }
  if (currentSeqDecrease.length > longSeqDecrease.length) {
    longSeqDecrease = currentSeqDecrease;
  }

  return {
    maxNumber,
    minNumber,
    sumAll,
    longSeqGrowth,
    longSeqDecrease
  };
}

// Головна функція
function main() {
  const filePath = process.argv[2] || '10m.txt';
  const numbers = readNumbersFromFile(filePath);

  if (numbers.length === 0) {
    console.log("Файл не містить валідних чисел");
    return;
  }

  const { maxNumber, minNumber, sumAll, longSeqGrowth, longSeqDecrease } = calculateStatistics(numbers);
  const mediana = findMedian(numbers);
  const arithmeticMean = Math.floor(sumAll / numbers.length);

  // Фіксуємо кінець вимірювання часу
  const endTime = Date.now();
  const executionTime = (endTime - startTime) / 1000;

  // Вивід результатів
  console.log("1. Максимальне число у файлі:", maxNumber);
  console.log("2. Мінімальне число у файлі:", minNumber);
  console.log("3. Медіана:", mediana);
  console.log("4. Середнє арифметичне значення:", arithmeticMean);
  console.log("5*. Масив найбільшої послідовності чисел, яка збільшується:", longSeqGrowth);
  console.log("6*. Масив найбільшої послідовності чисел, які зменшуються:", longSeqDecrease);
  console.log("Час виконання:", executionTime, "секунд");
}

main();
