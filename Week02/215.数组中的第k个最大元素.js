/*
 * @lc app=leetcode.cn id=215 lang=javascript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
 var findKthLargest = function (nums, k) {
    return quickSelect(nums, nums.length - k)
  };
  
  let quickSelect = (arr, k) => {
    return quick(arr, 0, arr.length - 1, k)
  }
  
  let quick = (arr, left, right, k) => {
    let index
    if (left < right) {
      // 划分数组
      index = partition(arr, left, right)
      // Top k
      if (k === index) {
        return arr[index]
      } else if (k < index) {
        // Top k 在左边
        return quick(arr, left, index - 1, k)
      } else {
        // Top k 在右边
        return quick(arr, index + 1, right, k)
      }
    }
    return arr[left]
  }
  
  let partition = (arr, left, right) => {
    var datum = arr[Math.floor(Math.random() * (right - left + 1)) + left],
      i = left,
      j = right
    while (i < j) {
      while (arr[i] < datum) {
        i++
      }
      while (arr[j] > datum) {
        j--
      }
      if (i < j) swap(arr, i, j)
      // 当数组中存在重复数据时，即都为datum，但位置不同
      // 继续递增i，防止死循环
      if (arr[i] === arr[j] && i !== j) {
        i++
      }
    }
    return i
  }
  
  // 交换
  let swap = (arr, i, j) => {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  // @lc code=end
  
  