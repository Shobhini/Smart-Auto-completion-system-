#include <bits/stdc++.h>
# include "TrieNode.h"
#include "Typos.h"

using namespace std;

string TrieNode::probableMistake(char c) {
    Typos *findTypo = new Typos();
    return findTypo -> neighbours[c];
}

void TrieNode::insertHistory(string word) {
    if (child.find(word[0]) == child.end()) {
        child[word[0]] = new TrieNode();
    }
    TrieNode *current = child[word[0]];
    int wordLength = word.length();
    for (int i = 1; i < wordLength; ++i) {
        ++current->search_frequency;
        if (current->child.find(word[i]) == current->child.end()) {
            current->child[word[i]] = new TrieNode();
        }
        current = current->child[word[i]];
    }
    if (!current->isWord)
        current->isWord = true;
    ++current->search_frequency;
}

vector<string> TrieNode::bfsSearch(string word) {
    vector<string> suggestions;
    TrieNode *current = this;

    if(child.find(word[0]) == child.end()) {
        string qwerty = probableMistake(word[0]);
        char letter;
        int frequency = -1;
        for (auto l : qwerty) {
            if (child.find(l) == child.end())
                continue;
            if (child[l]->search_frequency > frequency) {
                frequency = child[l]->search_frequency;
                letter = l;
            }
        }
        if (frequency != -1) {
            current = child[letter];
        } else
            return suggestions;;
    } else current = child[word[0]];
    int wordLength = word.length();
    for (int i = 1; i < wordLength; ++i) {
        if (current->child.find(word[i]) != current->child.end()) {
            current = current->child[word[i]];
            continue;
        }
        string qwerty = probableMistake(word[i]);
        char letter;
        int frequency = -1;
        for (auto l : qwerty) {
            if (current->child.find(l) == current->child.end())
                continue;
            if (current->child[l]->search_frequency > frequency) {
                frequency = current->child[l]->search_frequency;
                letter = l;
            }
        }
        if (frequency != -1) {
            current = current->child[letter];
        } else break;
    }
    priority_queue<pair<pair<int, string>, TrieNode *>> suggestionQueue;
    suggestionQueue.push({{current->search_frequency, ""}, current});
    while (suggestions.size() < 3 and !suggestionQueue.empty()) {
        auto currentNode = suggestionQueue.top();
        suggestionQueue.pop();
        if (currentNode.second->isWord) {
            suggestions.push_back(word + currentNode.first.second);
        }
        for (auto children : currentNode.second->child) {
            suggestionQueue.push({
                {children.second->search_frequency, currentNode.first.second + children.first},
                children.second
            });
        }
    }
    return suggestions;
}

int main() {
    TrieNode *root = new TrieNode();
    cout << "1 Already Searched Word \n2 Word completion \n3 End" << endl << flush;
    int choice;
    string word;
    while (true) {
        cin >> choice;
        if (choice == 3)
            break;
        if (choice == 1) {
            cin >> word;
            root -> insertHistory(word);
        }else if (choice == 2) {
            cin >> word;
            vector<string> ans = root -> bfsSearch(word);
            for(auto suggestedWord : ans) {
                cout << suggestedWord << endl << flush;
            }
        }else {
            cout << "Wrong Choice!!!" << endl << flush;
        }
    }
    delete root;
    return 0;
}