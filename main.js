let arr = [];
let isRunning = false;
let isStopFunc = false;
let buttPiramid = document.getElementById("piramid");
let buttBubble = document.getElementById("bubble");
let buttSelect = document.getElementById("select");
let buttInsert = document.getElementById("insert");
let buttQuick = document.getElementById("quick");
let buttMerge = document.getElementById("merge");
let sortName = document.getElementById("sortName");
let but2 = document.getElementById("second");
let but = document.getElementById("first");
let sidebarButt = document.getElementById("top-butt");
let overlay = document.getElementById("overlay");
let div = document.getElementById("array");
let rangeInput = document.getElementById('rangeInput');
let sliderValue = document.getElementById("sliderValue");
let func = function() {};
//один раз при запуске

function paint(active=-1, passive=-1, sorted=[]) {
  let maxValue = parseInt(rangeInput.value);
  
  div.innerHTML = "";
  for (let i = 0; i < arr.length; i ++) {    
  
    let child = document.createElement("div");
    //child.style.width = (divWidth / parseInt(rangeInput.value)) * 100 + "%";
    child.style.height = (arr[i] / maxValue) * 100 + "%";
    //child.style.borderRadius = "1px";
    child.style.background = "linear-gradient(to top, #d5d5d5 0%, #c5c5c5 20%, #b0b0b0 50%, #9a9a9a 80%, #858585 100%)";
    //child.style.boxShadow = "0 0 4px rgba(0,0,0,0.5)";
    
    if (sorted.includes(i)) {
      //child.style.background = "#5dd473";
    }
    
    if (i == active) {
      child.style.background = "#ff4545"; //ca1185 ff4545
    }
    
    if (i == passive) {
      child.style.background = "#e3dc5f";
    }
      
    div.appendChild(child);
  }
}

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

async function wrapper() {
  if (isRunning) return;   // защита от повторного запуска
  isRunning = true;
  isStopFunc = false;
  document.body.classList.toggle('getButtonsWeak');
  
  await func();
  paint();
  
  isRunning = false; 
  isStopFunc = false; 
  document.body.classList.toggle('getButtonsWeak');
}

async function mergeSort(event=0, start = 0, end = arr.length - 1) {
  if (isStopFunc) return true;
  if (start >= end) return false;
  
  const mid = Math.floor((start + end) / 2);
  
  // Визуализация разделения
  paint(start, end);
  await sleep(40);
  
  if (await mergeSort(0, start, mid)) return true;
  if (await mergeSort(0, mid + 1, end)) return true;
  
  await merge(start, mid, end);
  
  // Визуализация результата
  paint();
  await sleep(5);
  
  return false;
}

async function merge(start, mid, end) {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  
  let i = 0, j = 0, k = start;
  
  while (i < left.length && j < right.length) {
    // Визуализация в основном массиве!
    if (isStopFunc) return true;
    paint(k, start + i);
    await sleep(10);
    
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
  }
  
  // Оставшиеся элементы
  while (i < left.length) {
    if (isStopFunc) return true;
    arr[k] = left[i];
    paint(k);
    await sleep(10);
    i++;
    k++;
  }
  
  while (j < right.length) {
    if (isStopFunc) return true;
    arr[k] = right[j];
    paint(k);
    await sleep(10);
    j++;
    k++;
  }
}

async function makeTree() {
  for (let i = arr.length - 1; i >= 0; i --) {
    let j = i;
    let k = 0;
    
    while (k < arr.length) {
      k = 2*j + 1;
      
      if (k >= arr.length) continue;
      
      if (k + 1 < arr.length && arr[k+1] > arr[k]) k ++;
      
      paint(j, k);
      if (isStopFunc) {
        paint();
        return; 
      }
      await sleep(10);
    
      if (arr[j] < arr[k]) [arr[j], arr[k]] = [arr[k], arr[j]];
      
      paint(j, k);
      if (isStopFunc) {
        paint();
        return; 
      }
      await sleep(10);
      
      j = k;
    }
  }
}

async function heapSort() {
  await makeTree();
  
  if (isStopFunc) {
    paint();
    return; 
  }
  
  [arr[0], arr[arr.length-1]] = [arr[arr.length-1], arr[0]];
   
  for (let i = 2; i <= arr.length - 1; i ++) {
    let k = 0;
    let j = 0;
    while (k <= arr.length - i) {
      k = 2*j + 1;
      
      if (k > arr.length - i) continue;
      
      if (k + 1 <= arr.length - i && arr[k+1] > arr[k]) k ++;
      
      paint(j, k);
      if (isStopFunc) {
        paint();
        return; 
      }
      await sleep(4);
    
     if (arr[j] < arr[k]) [arr[j], arr[k]] = [arr[k], arr[j]];
      
      paint(j, k);
      await sleep(4);
      
      j = k;
    }  
    
    [arr[0], arr[arr.length-i]] = [arr[arr.length-i], arr[0]];
  }
  
  paint();
}

async function quickSort(event, low=0, high=parseInt(rangeInput.value)-1) {
  if (isStopFunc) {
    return true; 
  }
  if (low >= high) {
    return 0;
  }
  
  let pivot = arr[high];
  let i = low;
  let j = high - 1;
  
  while (i <= j) {
    paint(i, j);
    
    while (arr[i] < pivot) {
      paint(i, j);
      if (isStopFunc) {
        return true; 
      }  
      await sleep(10); 
      i ++;
    }
    while (arr[j] > pivot) {
      paint(i, j);
      if (isStopFunc) {
        return true; 
      }
      await sleep(10);
      j --;
    }
    
    if (isStopFunc) {
      return true; 
    }
    
    if (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      j --;
    }
  }
  
  [arr[i], arr[high]] = [arr[high], arr[i]];
  //paint(i, j);
  if (await quickSort(0, low, i - 1)) return true;
  if (await quickSort(0, i + 1, high)) return true;
  
  paint();
}

async function selectionSort() {
  sorted = [];
  
  for (let i = 0; i < arr.length; i ++) {
    let min = arr[i];
    let i_min = i;
    for (let j = i; j < arr.length; j ++) {
      paint(i_min, j, sorted);
   
      if (arr[j] < min) {
        min = arr[j];
        i_min = j;
      }
      if (isStopFunc) {
        paint();
        return; 
      } 
      await sleep(4);
    }
    
    paint(i_min, i, sorted);
    await sleep(6);
    
    let buf = arr[i];
    arr[i] = arr[i_min];
    arr[i_min] = buf;
    sorted.push(i);
    
  }
  
  paint();
}

async function insertSort() {
  sorted = [0];
  
  for (let i = 1; i < arr.length; i ++) {
    let j = i;
    if (isStopFunc) {
      paint();
      return; 
    } 
    while (j > 0 && arr[j] < arr[j-1]) {
      if (isStopFunc) {
        paint();
        return; 
      } 
      paint(j, j-1, sorted);
      let buf = arr[j];
      arr[j] = arr[j-1];
      arr[j-1] = buf;
      j -= 1;
      
      await sleep(10);
    } 
     
    await sleep(10);
    paint(j, j + 1, sorted);
    await sleep(10);
    
    sorted.push(i);
  }   
  
  paint();
}

async function bubbleSort() {
  let sorted = [];
  let flag = true;
  let j = 0;
  
  while (flag) {
   
    flag = false;
    
    for (let i = 0; i < arr.length-j; i ++) {
      
      paint(i, -1, sorted);
      
      if (arr[i] > arr[i+1]) {
        flag = true;
        let buf = arr[i];
        arr[i] = arr[i+1];
        arr[i+1] = buf;
      }    
      
      if (isStopFunc) {
        paint();
        return; 
      }
      
      await sleep(6);
    }  
    sorted.push(arr.length-j-1);
    
    j ++;  
  }   
  
  paint(); 
}

buttMerge.addEventListener("click", function() {
  sortName.textContent = "Merge Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = mergeSort;
});

buttQuick.addEventListener("click", function() {
  sortName.textContent = "Quick Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = quickSort;
});

buttInsert.addEventListener("click", function() {
  sortName.textContent = "Insert Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = insertSort;
});

buttSelect.addEventListener("click", function() {
  sortName.textContent = "Selection Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = selectionSort;
});

buttBubble.addEventListener("click", function() {
  sortName.textContent = "Bubble Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = bubbleSort;
});

buttPiramid.addEventListener("click", function() {
  sortName.textContent = "Heap Sort";
  document.getElementById('overlay').classList.toggle('is-seen');
  func = heapSort;
});

sidebarButt.addEventListener("click", function() {
  document.getElementById('overlay').classList.toggle('is-seen');
});

but2.addEventListener("click", wrapper);

but.addEventListener("click", async function() {
  if (isRunning) return;
  if (isStopFunc) {
    isStopFunc = false;
  }
  document.body.classList.toggle('getButtonsWeak');
  isRunning = true;
  
  for (let i = 0; i < arr.length - 1; i ++) {
    const j = Math.floor(i + Math.random() * (arr.length - i));
    
    if (isStopFunc) {
      document.body.classList.toggle('getButtonsWeak');
      isRunning = false;
      return;
    }
    
    paint(i, j);
    await sleep(5);
    
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  document.body.classList.toggle('getButtonsWeak');
  paint();
  
  isRunning = false;
});

rangeInput.addEventListener('input', function() {
  isStopFunc = true;
  
  sliderValue.textContent = "Элементов: " + this.value;
  
  // Обновляем глобальную переменную
  arrSize = parseInt(this.value);
  
  arr = [];
  for (let i = 1; i <= arrSize; i ++) {
    arr.push(i);
  }
  
  paint();
});

function main() {
  func = bubbleSort;
  
  for (let i = 1; i <= parseInt(rangeInput.value); i++) {
    arr.push(i);
  }
  
  paint();
}

main();
