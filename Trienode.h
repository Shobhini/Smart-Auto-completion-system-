#ifndef TRIENODE_H
#define TRIENODE_H

#include <unordered_map>
#include <vector>
#include <string>
#include <queue>

using namespace std;
class TrieNode {
public:
    std::unordered_map<char, TrieNode*> child;
    int search_frequency= 0;
    bool isWord = false;

    void insertHistory(string word);

    vector<string> bfsSearch(string word);

    string probableMistake(char c);
};

#endif