#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> arr = {2, 7, 11, 15};
    int target = 9;

    unordered_map<int, int> mp;

    for (int i = 0; i < arr.size(); i++) {
        int need = target - arr[i];

        if (mp.find(need) != mp.end()) {
            cout << mp[need] << " " << i << endl;
            return 0;
        }

        mp[arr[i]] = i;
    }

    return 0;
}


